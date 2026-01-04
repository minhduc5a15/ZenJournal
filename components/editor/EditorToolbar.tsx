import { Save, Trash2, FileText, View, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface EditorToolbarProps {
  onSave: () => void;
  onDelete?: () => void;
  saving: boolean;
  mode: 'write' | 'preview';
  setMode: (mode: 'write' | 'preview') => void;
  canSave: boolean;
  canDelete: boolean;
}

export const EditorToolbar = ({
  onSave,
  onDelete,
  saving,
  mode,
  setMode,
  canSave,
  canDelete,
}: EditorToolbarProps) => {
  const router = useRouter();

  return (
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
              mode === 'write'
                ? "bg-white dark:bg-stone-700 shadow-sm text-stone-800 dark:text-stone-100"
                : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
            )}
            title="Write Mode"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode('preview')}
            className={cn(
              "p-2 rounded-full transition-all",
              mode === 'preview'
                ? "bg-white dark:bg-stone-700 shadow-sm text-stone-800 dark:text-stone-100"
                : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
            )}
            title="Preview Mode"
          >
            <View className="w-4 h-4" />
          </button>
        </div>

        {canDelete && onDelete && (
          <button
            onClick={onDelete}
            className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-2.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            title="Delete Entry"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onSave}
          disabled={saving || !canSave}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg",
            saving || !canSave
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
  );
};
