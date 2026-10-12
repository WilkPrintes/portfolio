"use client";

import { useTerminal } from "@/components/terminal";
import { RollText } from "@/components/ui/roll-text";

export function TerminalButton({ label }: { label: string }) {
  const { toggle } = useTerminal();

  return (
    <button
      type="button"
      onClick={toggle}
      data-nav-item
      data-terminal-toggle
      className="group relative hidden overflow-hidden rounded-md border border-line px-2.5 py-1 font-mono text-xs text-muted transition-[color,border-color,scale] duration-300 hover:border-accent hover:text-ink active:scale-95 sm:inline-flex sm:items-center sm:gap-1.5"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
      />
      <span
        aria-hidden="true"
        className="relative inline-block transition-transform duration-500 group-hover:rotate-360"
      >
        ~
      </span>
      <RollText className="relative">{label}</RollText>
    </button>
  );
}
