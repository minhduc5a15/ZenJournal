"use client";

import { FC, useState } from "react";
import { BookOpen, LogOut, Plus, Sparkles, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getGreeting } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout: FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isLoginPage = pathname === "/login";

  // If on login page, render a simplified layout or just children
  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8] dark:bg-stone-950 text-stone-800 dark:text-stone-100 selection:bg-rose-100 dark:selection:bg-rose-900 selection:text-rose-900 dark:selection:text-rose-100 transition-colors duration-300">
      {/* Background Texture/Gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-[-1] opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, #fff1f2 0%, transparent 50%)",
        }}
      />

      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#FDFCF8]/70 dark:bg-stone-950/70 border-b border-stone-200/50 dark:border-stone-800/50 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-200 dark:bg-rose-900 blur rounded-lg opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative bg-white dark:bg-stone-900 p-1.5 sm:p-2 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm group-hover:-translate-y-0.5 transition-transform duration-300">
                <BookOpen className="w-5 h-5 text-rose-500 dark:text-rose-400" />
              </div>
            </div>
            <span className="text-lg sm:text-xl font-serif font-bold text-stone-800 dark:text-stone-100 tracking-tight">
              ZenJournal
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {user && (
              <>
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                  <span className="text-stone-400 dark:text-stone-500 text-sm font-serif italic">
                    {getGreeting()},{" "}
                    <span className="text-stone-600 dark:text-stone-300 font-medium not-italic">
                      {user.name?.split(" ")[0] || "friend"}
                    </span>
                  </span>

                  <div className="h-4 w-px bg-stone-200 dark:bg-stone-800" />

                  <div className="flex items-center gap-3">
                    <Link
                      href="/entry/new"
                      className="flex items-center gap-2 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-stone-200 dark:shadow-stone-900/50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Entry</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="p-2 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 text-stone-500 dark:text-stone-400"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-stone-100 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-400">
                <span>{user.name}</span>
                <span className="font-serif italic">{getGreeting()}</span>
              </div>
              <Link
                href="/entry/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-3 rounded-xl font-medium"
              >
                <Plus className="w-4 h-4" /> New Entry
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 py-3 rounded-xl font-medium"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="py-8 text-center border-t border-stone-100 dark:border-stone-800 mt-auto bg-[#FDFCF8] dark:bg-stone-950 transition-colors duration-300">
        <div className="flex items-center justify-center gap-2 text-stone-400 dark:text-stone-600 text-xs sm:text-sm">
          <Sparkles className="w-3 h-3 text-rose-300 dark:text-rose-700" />
          <span>Crafted for your thoughts</span>
        </div>
      </footer>
    </div>
  );
};