"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type TerminalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const TerminalContext = createContext<TerminalContextValue | null>(null);

/** `~` toggles the terminal. Covers US layouts (Backquote) and ABNT2 dead keys. */
export function isTerminalHotkey(event: KeyboardEvent) {
  return (
    event.code === "Backquote" ||
    event.key === "~" ||
    event.key === "`" ||
    (event.key === "Dead" && event.code === "Quote")
  );
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Typing fields handle their own keys (including the terminal input).
      if (event.target instanceof Element && event.target.closest("input, textarea, [contenteditable]")) return;

      if (isTerminalHotkey(event)) {
        event.preventDefault();
        toggle();
      } else if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle, close]);

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);

  return <TerminalContext value={value}>{children}</TerminalContext>;
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) throw new Error("useTerminal must be used within <TerminalProvider>");
  return context;
}
