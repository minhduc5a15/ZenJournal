import { Eye } from "lucide-react";
import { Visibility } from "@/types";

interface VisibilitySelectorProps {
  value: Visibility;
  onChange: (visibility: Visibility) => void;
}

export const VisibilitySelector = ({ value, onChange }: VisibilitySelectorProps) => {
  return (
    <div className="relative group">
      <div className="flex items-center gap-2 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-pointer">
        <Eye className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
        <select
          className="bg-transparent outline-none cursor-pointer appearance-none text-stone-600 dark:text-stone-300 pr-4 text-xs sm:text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value as Visibility)}
        >
          {Object.values(Visibility).map((v) => (
            <option key={v} value={v} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200">
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
