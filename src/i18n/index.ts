import type { Locale } from "./types";

export const locales: Locale[] = ["pt", "en"];
export const defaultLocale: Locale = "pt";

export { LanguageProvider, useLanguage } from "./language-provider";
export type { Dictionary, Education, Job, Locale, Project } from "./types";
