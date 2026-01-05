"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Entry, Mood, Visibility } from "@/types";
import {
  createEntry,
  getEntry,
  updateEntry,
  deleteEntry,
} from "@/services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Clock, AlertTriangle, CheckCircle2, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mode, setMode] = useState<"write" | "preview">("write");
  
  const [formData, setFormData] = useState<Partial<Entry>>(
    initialData || {
      title: "",
      content: "",
      mood: Mood.Neutral,
      tags: [],
      visibility: Visibility.Private,
    }
  );

  const currentEntryIdRef = useRef<string | undefined>(entryId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && mode === "write") {
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
          if (entry) {
            setFormData(entry);
            setLastSaved(new Date(entry.updatedAt));
          }
        })
        .finally(() => setLoading(false));
    }
  }, [entryId, initialData]);

  const performSave = useCallback(async (isManual: boolean = false) => {
    if (!formData.title && !formData.content) return;
    if (!user) return;

    if (isManual) setSaving(true);
    else setIsAutoSaving(true);

    try {
      const entryData = { ...formData, userId: user._id };
      let savedEntry: Entry;
      
      if (currentEntryIdRef.current) {
        savedEntry = await updateEntry(currentEntryIdRef.current, entryData);
      } else {
        savedEntry = await createEntry(entryData);
        currentEntryIdRef.current = savedEntry._id;
        // Update URL without refreshing to reflect new entry ID
        window.history.replaceState(null, "", `/entry/${savedEntry._id}`);
      }
      
      setLastSaved(new Date());
      if (isManual) {
        toast.success("Entry saved successfully");
        router.push("/");
      }
    } catch (e: any) {
      if (isManual) {
        toast.error(e.message || "Failed to save entry");
      }
      console.error("Save error:", e);
    } finally {
      setSaving(false);
      setIsAutoSaving(false);
    }
  }, [formData, user, router]);

  // Handle Auto-save logic
  useEffect(() => {
    if (!user || loading) return;

    // Check if there's actually content to save
    if (!formData.title && !formData.content) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer for 1000ms
    autoSaveTimerRef.current = setTimeout(() => {
      performSave(false);
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData.title, formData.content, formData.mood, formData.tags, formData.visibility, performSave, user, loading]);

  const handleManualSave = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    performSave(true);
  };

  const confirmDelete = async () => {
    if (!currentEntryIdRef.current) return;
    setDeleting(true);
    try {
      await deleteEntry(currentEntryIdRef.current);
      toast.success("Entry deleted");
      router.push("/");
    } catch (e) {
      toast.error("Failed to delete entry");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto pb-20 relative"
      >
        <EditorToolbar
          onSave={handleManualSave}
          onDelete={currentEntryIdRef.current ? () => setShowDeleteModal(true) : undefined}
          saving={saving}
          mode={mode}
          setMode={setMode}
          canSave={!!(formData.title || formData.content)}
          canDelete={!!currentEntryIdRef.current}
        />

        <div className="space-y-8 px-1 sm:px-0">
          {/* Meta Controls & Status */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-500">
            <MoodSelector
              value={formData.mood as Mood}
              onChange={(mood) => setFormData((prev) => ({ ...prev, mood }))}
            />

            <VisibilitySelector
              value={formData.visibility as Visibility}
              onChange={(visibility) =>
                setFormData((prev) => ({ ...prev, visibility }))
              }
            />

            <div className="ml-auto flex items-center gap-4">
               {/* Auto-save Status Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold">
                {isAutoSaving ? (
                  <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : lastSaved ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 opacity-80">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Saved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
                    <Save className="w-3 h-3" />
                    <span>Unsaved</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1.5 bg-stone-50 dark:bg-stone-900 px-3 py-1.5 rounded-full border border-stone-100 dark:border-stone-800">
                <Clock className="w-3 h-3" />
                {formatDate(lastSaved?.toISOString() || new Date().toISOString())}
              </div>
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
            {mode === "write" ? (
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                >
                  {formData.content || "*Nothing to preview*"}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <TagInput
            tags={formData.tags || []}
            onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
          />
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-2xl border border-stone-100 dark:border-stone-800"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100">
                    Delete this entry?
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    This action cannot be undone. This entry will be permanently
                    removed from your journal.
                  </p>
                </div>

                <div className="flex gap-3 w-full pt-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-lg shadow-rose-200 dark:shadow-rose-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      "Delete Forever"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
