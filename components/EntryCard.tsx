import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Entry, Mood } from "@/types";
import { Pin } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EntryCardProps {
  entry: Entry;
  onClick: (id: string) => void;
  index?: number;
}

const MoodColors: Record<Mood, string> = {
  [Mood.Happy]: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800",
  [Mood.Sad]: "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800",
  [Mood.Neutral]: "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700",
  [Mood.Anxious]: "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800",
  [Mood.Excited]: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
};

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onClick,
  index = 0,
}) => {
  const dateObj = new Date(entry.createdAt);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString(undefined, { month: "short" });
  const year = dateObj.getFullYear();
  const time = dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => onClick(entry._id)}
      className="group relative flex flex-col bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-7 cursor-pointer 
                 border border-stone-100 dark:border-stone-800 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]
                 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] hover:-translate-y-1
                 transition-all duration-300 ease-out overflow-hidden"
    >
      {/* Pinned Gradient Line */}
      {entry.pinned && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-300 via-orange-200 to-amber-200 dark:from-rose-500 dark:via-orange-400 dark:to-amber-400" />
      )}

      {/* Header with Date Block */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          {/* Date Block */}
          <div className="flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl w-12 h-14 shrink-0 font-serif">
            <span className="text-[10px] uppercase text-stone-400 dark:text-stone-500 font-bold tracking-wider">
              {month}
            </span>
            <span className="text-xl font-bold text-stone-800 dark:text-stone-200 leading-none mt-0.5">
              {day}
            </span>
          </div>

          <div className="space-y-1">
            <h3
              className={cn(
                "text-lg font-bold text-stone-800 dark:text-stone-100 leading-snug font-serif group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors",
                !entry.title && "italic text-stone-400"
              )}
            >
              {entry.title || "Untitled Entry"}
            </h3>
            <div className="text-xs text-stone-400 dark:text-stone-500 font-medium flex items-center gap-2">
              <span>{time}</span>
              {year !== new Date().getFullYear() && <span>• {year}</span>}
            </div>
          </div>
        </div>

        {entry.pinned && (
          <Pin className="w-4 h-4 text-rose-400 rotate-45 shrink-0" />
        )}
      </div>

      {/* Content Snippet */}
      <div className="text-stone-500 dark:text-stone-400 font-serif leading-relaxed line-clamp-3 mb-6 flex-grow text-[15px] prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-headings:text-base prose-headings:my-0">
         <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            allowedElements={['p', 'strong', 'em', 'del', 'span', 'code', 'text']}
            unwrapDisallowed={true}
         >
            {entry.content}
         </ReactMarkdown>
      </div>

      {/* Footer Tags & Mood */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-50 dark:border-stone-800">
        <div className="flex gap-2 overflow-hidden flex-wrap">
          {entry.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium tracking-wide text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 px-2 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
          {entry.tags.length > 3 && (
            <span className="text-[10px] text-stone-400 dark:text-stone-500 py-1">
              + {entry.tags.length - 3}
            </span>
          )}
        </div>

        <div
          className={cn(
            "text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider border",
            MoodColors[entry.mood] || MoodColors[Mood.Neutral]
          )}
        >
          {entry.mood}
        </div>
      </div>
    </motion.div>
  );
};
