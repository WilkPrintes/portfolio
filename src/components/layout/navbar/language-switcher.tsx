"use client";

import { locales, useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      data-nav-item
      role="group"
      aria-label="Idioma / Language"
      className="relative flex rounded-md border border-line p-0.5 font-mono text-xs"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded bg-accent transition-transform duration-300 ease-out",
          locale === "en" && "translate-x-full",
        )}
      />
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            "relative z-10 w-9 rounded py-1 uppercase transition-colors",
            locale === code ? "text-ink" : "text-muted hover:text-foreground",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
