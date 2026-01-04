import { Smile } from "lucide-react";
import { Mood } from "@/types";

interface MoodSelectorProps {
  value: Mood;
  onChange: (mood: Mood) => void;
}

export const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
  return (
    <div className="relative group">
      <div className="flex items-center gap-2 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-md transition-all cursor-pointer">
        <Smile className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
        <select
          className="bg-transparent outline-none cursor-pointer appearance-none text-stone-600 dark:text-stone-300 pr-4 text-xs sm:text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value as Mood)}
        >
          {Object.values(Mood).map((m) => (
            <option key={m} value={m} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200">
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
