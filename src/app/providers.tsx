"use client";

import type { ReactNode } from "react";
import { TerminalProvider } from "@/components/terminal";
import { LanguageProvider } from "@/i18n";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <TerminalProvider>{children}</TerminalProvider>
    </LanguageProvider>
  );
}
