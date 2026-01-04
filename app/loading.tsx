import { cn } from "@/lib/utils";

const SkeletonCard = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-7 border border-stone-100 dark:border-stone-800 h-[280px]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4 w-full">
          <div className="w-12 h-14 bg-stone-100 dark:bg-stone-800 rounded-xl animate-pulse shrink-0" />
          <div className="space-y-2 w-full">
            <div className="h-6 w-3/4 bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse" />
            <div className="h-3 w-1/4 bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="flex-grow space-y-2 mb-6">
        <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse" />
        <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse" />
        <div className="h-4 w-2/3 bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse" />
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-50 dark:border-stone-800">
        <div className="flex gap-2">
            <div className="w-12 h-5 bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse" />
            <div className="w-12 h-5 bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse" />
        </div>
        <div className="w-16 h-6 bg-stone-100 dark:bg-stone-800 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default function Loading() {
  return (
    <div className="space-y-8 sm:space-y-12 animate-in fade-in duration-500">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center space-y-6 pt-2 pb-6">
            <div className="h-8 w-64 bg-stone-100 dark:bg-stone-800 rounded-lg animate-pulse" />
            <div className="w-full max-w-xl h-12 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    </div>
  );
}