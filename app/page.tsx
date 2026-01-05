"use client";

import { useState } from "react";
import useSWR from "swr";
import { Entry, Mood } from "@/types";
import { EntryCard } from "@/components/EntryCard";
import { Search, Loader2, Filter, X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// Updated fetcher to return the full paginated object
const fetcher = async (url: string): Promise<PaginatedResponse<Entry>> => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().logout();
    }
    throw new Error("An error occurred while fetching the data.");
  }
  
  return await res.json();
};

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [mood, setMood] = useState<Mood | "">("");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams();
  if (user) queryParams.set("userId", user._id);
  if (search) queryParams.set("search", search);
  if (mood) queryParams.set("mood", mood);
  queryParams.set("page", page.toString());
  queryParams.set("limit", "10");

  const { data, isLoading } = useSWR<PaginatedResponse<Entry>>(
    user ? `/api/entries?${queryParams.toString()}` : null,
    fetcher,
    { keepPreviousData: true }
  );

  const entries = data?.data || [];
  const meta = data?.meta;
  const moodOptions = Object.values(Mood);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            ZenJournal
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg max-w-md mx-auto leading-relaxed">
            Your minimalist sanctuary for thoughts, dreams, and memories.
            Distraction-free and secure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full bg-stone-900 dark:bg-stone-100 px-8 text-sm font-medium text-white dark:text-stone-900 shadow-lg shadow-stone-200 dark:shadow-stone-900/50 transition-transform hover:scale-105 active:scale-95 hover:bg-stone-800 dark:hover:bg-stone-200"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    );
  }

  const hasActiveFilters = search || mood;

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header Section */}
      <section className="flex flex-col items-center space-y-6 pt-2 pb-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 text-center"
        >
          Your collection of moments
        </motion.h2>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xl relative group z-10"
        >
          {/* Glowing Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

          <div className="relative flex items-center bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 focus-within:border-rose-200 dark:focus-within:border-rose-800 focus-within:ring-4 focus-within:ring-rose-50 dark:focus-within:ring-rose-900/20 transition-all overflow-hidden">
            <Search className="ml-4 w-5 h-5 text-stone-400 dark:text-stone-500 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-12 bg-transparent border-none outline-none text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 px-4 text-base"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to first page on search
              }}
            />

            {(search || mood) && (
              <button
                onClick={() => {
                  setSearch("");
                  setMood("");
                  setShowFilters(false);
                  setPage(1);
                }}
                className="p-2 mr-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="h-6 w-px bg-stone-100 dark:bg-stone-800 mx-1" />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 mr-2 rounded-xl transition-all duration-200",
                showFilters || mood
                  ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                  : "text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Filters Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 p-1">
                {moodOptions.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMood(mood === m ? "" : m);
                      setPage(1); // Reset to first page on filter
                    }}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-medium border transition-all",
                      mood === m
                        ? "bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-800 dark:border-stone-100 shadow-md"
                        : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Grid Content */}
      {isLoading && !data ? (
        <div className="flex flex-col items-center py-24 opacity-60">
          <Loader2 className="w-8 h-8 animate-spin text-stone-400 dark:text-stone-500 mb-3" />
          <span className="text-sm text-stone-400 dark:text-stone-500 font-medium animate-pulse">
            Gathering memories...
          </span>
        </div>
      ) : entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 px-6"
        >
          {hasActiveFilters ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-stone-50 dark:bg-stone-900 rounded-full flex items-center justify-center text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-serif font-medium text-stone-800 dark:text-stone-100">
                No matches found
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setMood("");
                  setPage(1);
                }}
                className="text-rose-600 dark:text-rose-400 text-sm font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="relative p-8 md:p-12 bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 max-w-lg mx-auto shadow-sm">
              <div className="mb-6 text-5xl">🍃</div>
              <h3 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-3">
                A fresh page awaits
              </h3>
              <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-xs mx-auto leading-relaxed">
                The best time to start writing your story is now. Capture a
                thought, a feeling, or a moment.
              </p>
              <Link
                href="/entry/new"
                className="inline-flex items-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-6 py-3 rounded-full font-medium hover:bg-stone-800 dark:hover:bg-stone-200 hover:shadow-lg transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Create First Entry
              </Link>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {entries.map((entry, index) => (
                <EntryCard
                  key={entry._id}
                  entry={entry}
                  index={index}
                  onClick={(id) => router.push(`/entry/${id}`)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination UI */}
          {meta && meta.totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 py-8 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1 px-4">
                  <span className="text-sm font-medium text-stone-800 dark:text-stone-200">
                    Page {page}
                  </span>
                  <span className="text-sm text-stone-400 dark:text-stone-600">
                    of {meta.totalPages}
                  </span>
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                Showing {entries.length} of {meta.total} memories
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}