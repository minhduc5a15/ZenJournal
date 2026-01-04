import { Entry, User } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";

// Headers are now simpler as cookie is handled by browser
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      return data.user;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: User }> => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }
  return res.json();
};

export const logout = async (): Promise<void> => {
  await fetch("/api/auth/logout", { method: "POST" });
};

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<{ user: User }> => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Registration failed");
  }
  return res.json();
};

export const getEntry = async (id: string): Promise<Entry | null> => {
  const res = await fetch(`/api/entries/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
};

export const createEntry = async (entry: Partial<Entry>): Promise<Entry> => {
  const res = await fetch("/api/entries", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  return res.json();
};

export const updateEntry = async (
  id: string,
  updates: Partial<Entry>
): Promise<Entry> => {
  const res = await fetch(`/api/entries/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update entry");
  return res.json();
};

export const deleteEntry = async (id: string): Promise<void> => {
  const res = await fetch(`/api/entries/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete entry");
};