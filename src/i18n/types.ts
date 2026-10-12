import type { pt } from "./dictionaries/pt";

export type Locale = "pt" | "en";

export type Job = {
  company: string;
  url?: string;
  role: string;
  period: string;
  product?: string;
  team?: string;
  summary: string;
  highlights: string[];
  stack: string[];
  featured?: boolean;
};

export type Education = {
  place: string;
  title: string;
  period: string;
  start: number;
  end: number;
  description: string;
  topics: string[];
  projects?: string[];
  featured?: boolean;
};

export type Project = {
  name: string;
  badge: string;
  kind: string;
  description: string;
  stack: string[];
  url?: string;
  repo?: string;
};

/** The Portuguese dictionary is the source of truth for the shape of every locale. */
export type Dictionary = typeof pt;
