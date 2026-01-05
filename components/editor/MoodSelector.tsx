"use client";

import { useState, useRef, useEffect } from "react";
import { Smile, ChevronDown } from "lucide-react";
import { Mood } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MoodSelectorProps {
  value: Mood;
  onChange: (mood: Mood) => void;
}

export const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-md transition-all text-xs sm:text-sm text-stone-600 dark:text-stone-300"
      >
        <Smile className="w-4 h-4 text-stone-400 dark:text-stone-500 text-rose-500 dark:text-rose-400" />
        <span className="capitalize">{value}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl shadow-xl z-30 py-2 overflow-hidden"
          >
            {Object.values(Mood).map((m) => (
              <li key={m}>
                <button
                  onClick={() => {
                    onChange(m);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm capitalize transition-colors",
                    value === m 
                        ? "bg-stone-50 dark:bg-stone-800 text-rose-600 dark:text-rose-400 font-medium" 
                        : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200"
                  )}
                >
                  {m}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
