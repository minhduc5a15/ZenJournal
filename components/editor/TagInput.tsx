import { useState } from "react";
import { Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  readOnly?: boolean;
}

export const TagInput = ({ tags, onChange, readOnly = false }: TagInputProps) => {
  const [input, setInput] = useState("");

  const addTag = (e: React.KeyboardEvent) => {
    if (readOnly) return;
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (readOnly) return;
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-8 border-t border-stone-100 dark:border-stone-800">
      <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500 mr-2">
        <Tag className="w-4 h-4" />
        <span className="text-sm font-medium uppercase tracking-wider text-[10px]">Tags</span>
      </div>

      <AnimatePresence mode="popLayout">
        {tags.map((tag) => (
            <motion.span
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            key={tag}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1 shadow-sm"
            >
            #{tag}
            {!readOnly && (
                <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-full p-0.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                <X className="w-3 h-3" />
                </button>
            )}
            </motion.span>
        ))}
      </AnimatePresence>

      {!readOnly && (
          <input
            type="text"
            className="bg-transparent text-sm outline-none w-40 placeholder-stone-400 dark:placeholder-stone-600 text-stone-700 dark:text-stone-300 py-1"
            placeholder="Add a tag..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={addTag}
          />
      )}
    </div>
  );
};