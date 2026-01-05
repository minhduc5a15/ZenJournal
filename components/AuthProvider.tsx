"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { checkSession } from "@/services/api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await checkSession();
        setUser(user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [setUser]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-stone-950 z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-stone-100 dark:border-stone-900 border-t-stone-800 dark:border-t-stone-200 rounded-full animate-spin" />
          <p className="text-sm font-serif text-stone-500 animate-pulse tracking-wide">
            Entering sanctuary...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
