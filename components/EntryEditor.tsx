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
import {
  Save,
  ArrowLeft,
  Trash2,
  Tag,
  Eye,
  Clock,
  Smile,
  MoreHorizontal,
  Check,
  X,
  FileText,
  View
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { cn, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

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
  const [tagInput, setTagInput] = useState("");
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
      router.push("/");
    } catch (e) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entryId || !confirm("Delete this entry?")) return;
    setSaving(true);
    await deleteEntry(entryId);
    router.push("/");
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag),
    }));
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
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#FDFCF8]/95 dark:bg-stone-950/95 backdrop-blur-md py-4 z-20 border-b border-transparent transition-colors">
        <button
          onClick={() => router.push("/")}
          className="group flex items-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <div className="p-2 rounded-full group-hover:bg-stone-100 dark:group-hover:bg-stone-800 transition-colors mr-1">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-sm font-medium hidden sm:inline-block">
            Back to Journal
          </span>
        </button>

        <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-full flex items-center mr-2">
                <button
                    onClick={() => setMode('write')}
                    className={cn(
                        "p-2 rounded-full transition-all",
                        mode === 'write' ? "bg-white dark:bg-stone-700 shadow-sm text-stone-800 dark:text-stone-100" : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
                    )}
                    title="Write Mode"
                >
                    <FileText className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setMode('preview')}
                    className={cn(
                        "p-2 rounded-full transition-all",
                        mode === 'preview' ? "bg-white dark:bg-stone-700 shadow-sm text-stone-800 dark:text-stone-100" : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
                    )}
                    title="Preview Mode"
                >
                    <View className="w-4 h-4" />
                </button>
            </div>

          {entryId && (
            <button
              onClick={handleDelete}
              className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-2.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              title="Delete Entry"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || (!formData.title && !formData.content)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg",
              saving
                ? "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed"
                : "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            )}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-300 dark:border-stone-600 border-t-stone-500 dark:border-t-stone-400 rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-8 px-1 sm:px-0">
        {/* Meta Controls (Mood, Visibility, Date) */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Mood Selector */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-md transition-all cursor-pointer">
              <Smile className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
              <select
                className="bg-transparent outline-none cursor-pointer appearance-none text-stone-600 dark:text-stone-300 pr-4 text-xs sm:text-sm"
                value={formData.mood}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mood: e.target.value as Mood,
                  }))
                }
              >
                {Object.values(Mood).map((m) => (
                  <option key={m} value={m} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visibility Selector */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-pointer">
              <Eye className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
              <select
                className="bg-transparent outline-none cursor-pointer appearance-none text-stone-600 dark:text-stone-300 pr-4 text-xs sm:text-sm"
                value={formData.visibility}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visibility: e.target.value as Visibility,
                  }))
                }
              >
                {Object.values(Visibility).map((v) => (
                  <option key={v} value={v} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

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

        {/* Tags Section */}
        <div className="flex flex-wrap items-center gap-2 pt-8 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500 mr-2">
            <Tag className="w-4 h-4" />
            <span className="text-sm">Tags:</span>
          </div>

          {formData.tags?.map((tag) => (
            <motion.span
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              key={tag}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1 shadow-sm"
            >
              #{tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-full p-0.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}

          <input
            type="text"
            className="bg-transparent text-sm outline-none w-40 placeholder-stone-400 dark:placeholder-stone-600 text-stone-700 dark:text-stone-300 py-1"
            placeholder="Type and press Enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
          />
        </div>
      </div>
    </motion.div>
  );
};
