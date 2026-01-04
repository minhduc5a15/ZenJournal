import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthState } from "@/types";

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "zenjournal-auth",
    }
  )
);
