"use client";

import { useEffect, useState, useRef } from "react";
import { Entry, Mood, Visibility } from "@/types";
import {
  createEntry,
  getEntry,
  updateEntry,
  deleteEntry,
} from "@/services/api";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MoodSelector } from "./editor/MoodSelector";
import { EditorToolbar } from "./editor/EditorToolbar";
import { TagInput } from "./editor/TagInput";
import { VisibilitySelector } from "./editor/VisibilitySelector";

interface EntryEditorProps {
  initialData?: Entry;
  entryId?: string;
}

export const EntryEditor: React.FC<EntryEditorProps> = ({
  initialData,
  entryId,
}: EntryEditorProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [formData, setFormData] = useState<Partial<Entry>>(
    initialData || {
      title: "",
      content: "",
      mood: Mood.Neutral,
      tags: [],
      visibility: Visibility.Private,
    }
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && mode === 'write') {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [formData.content, mode]);

  useEffect(() => {
    if (entryId && !initialData) {
      setLoading(true);
      getEntry(entryId)
        .then((entry) => {
          if (entry) setFormData(entry);
        })
        .finally(() => setLoading(false));
    }
  }, [entryId, initialData]);

  const handleSave = async () => {
    if (!formData.title && !formData.content) return;
    if (!user) return;

    setSaving(true);
    try {
      const entryData = { ...formData, userId: user._id };
      if (entryId) await updateEntry(entryId, entryData);
      else await createEntry(entryData);
      toast.success("Entry saved successfully");
      router.push("/");
    } catch (e) {
      toast.error("Failed to save entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    // We can't use native confirm if strictly following no-alert rule, but usually confirm is acceptable.
    // However, prompts says "Remove Native Alerts". I'll use a simple confirm for now or sonner with action.
    // Sonner with action is better UX.
    toast("Are you sure?", {
        action: {
            label: "Delete",
            onClick: async () => {
                setSaving(true);
                try {
                    if (entryId) await deleteEntry(entryId);
                    toast.success("Entry deleted");
                    router.push("/");
                } catch(e) {
                    toast.error("Failed to delete");
                }
            }
        }
    })
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <span className="animate-pulse text-stone-400 dark:text-stone-500 font-serif">
          Opening journal...
        </span>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto pb-20 relative"
    >
      <EditorToolbar 
        onSave={handleSave}
        onDelete={entryId ? handleDelete : undefined}
        saving={saving}
        mode={mode}
        setMode={setMode}
        canSave={!!(formData.title || formData.content)}
        canDelete={!!entryId}
      />

      <div className="space-y-8 px-1 sm:px-0">
        {/* Meta Controls (Mood, Visibility, Date) */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-500">
          
          <MoodSelector 
            value={formData.mood as Mood} 
            onChange={(mood) => setFormData(prev => ({ ...prev, mood }))} 
          />

          <VisibilitySelector 
            value={formData.visibility as Visibility}
            onChange={(visibility) => setFormData(prev => ({ ...prev, visibility }))}
          />

          <div className="ml-auto text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1.5 bg-stone-50 dark:bg-stone-900 px-3 py-1.5 rounded-full">
            <Clock className="w-3 h-3" />
            {formatDate(new Date().toISOString())}
          </div>
        </div>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Untitled Entry"
          className="w-full text-4xl sm:text-5xl font-serif font-bold text-stone-800 dark:text-stone-100 placeholder-stone-300 dark:placeholder-stone-700 bg-transparent border-none focus:ring-0 outline-none p-0 tracking-tight"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          autoFocus={!entryId}
        />

        {/* Content Area */}
        <div className="min-h-[50vh] relative">
            {mode === 'write' ? (
                <textarea
                    ref={textareaRef}
                    placeholder="What's on your mind? (Markdown supported)"
                    className="w-full h-full resize-none outline-none text-lg sm:text-xl text-stone-700 dark:text-stone-300 font-serif leading-loose bg-transparent border-none focus:ring-0 placeholder-stone-300 dark:placeholder-stone-700"
                    value={formData.content}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    spellCheck={false}
                />
            ) : (
                <div className="prose prose-stone dark:prose-invert prose-lg max-w-none font-serif leading-loose text-stone-700 dark:text-stone-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.content || "*Nothing to preview*"}
                    </ReactMarkdown>
                </div>
            )}
        </div>

        <TagInput 
            tags={formData.tags || []} 
            onChange={(tags) => setFormData(prev => ({ ...prev, tags }))} 
        />
      </div>
    </motion.div>
  );
};