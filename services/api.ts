import { Entry, User } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";

// Helper to get headers with token
const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
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

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<{ user: User; token: string }> => {
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
