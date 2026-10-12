import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a number with leading zeros, e.g. `pad(3)` → `"03"`. */
export function pad(value: number, length = 2) {
  return String(value).padStart(length, "0");
}
