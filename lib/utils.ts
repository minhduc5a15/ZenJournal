import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Escapes special characters in a string for use in a regular expression.
 * Prevents Regex Denial of Service (ReDoS) by ensuring user input is treated as literal.
 */
export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\\]/g, "\\$& ");
}