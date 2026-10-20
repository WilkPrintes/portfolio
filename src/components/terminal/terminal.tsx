"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { Window } from "@/components/ui/window";
import { useLanguage } from "@/i18n";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { runCommand } from "./commands";
import { isTerminalHotkey, useTerminal } from "./terminal-provider";
import { useCommandHistory } from "./use-command-history";

const PROMPT = "wilk@portfolio:~$";

type Line = { id: number; content: ReactNode };

/** Quake-style terminal that drops down from the top of the page. */
export function Terminal() {
  const { t } = useLanguage();
  const { isOpen, close } = useTerminal();
  const history = useCommandHistory();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (isOpen) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else if (panel.contains(document.activeElement) || document.activeElement === document.body) {
      // `inert` may already have blurred the input to <body> by the time this runs.
      returnFocusRef.current?.focus({ preventScroll: true });
    }

    gsap.to(panel, {
      yPercent: isOpen ? 0 : -105,
      duration: prefersReducedMotion() ? 0 : 0.45,
      ease: isOpen ? "expo.out" : "power2.in",
      onStart: () => {
        if (isOpen) panel.style.visibility = "visible";
      },
      onComplete: () => {
        if (isOpen) inputRef.current?.focus({ preventScroll: true });
        else panel.style.visibility = "hidden";
      },
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || panelRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-terminal-toggle]")) return;
      close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen, close]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [lines]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const raw = input.trim();
    setInput("");
    if (!raw) return;
    history.push(raw);

    const name = raw.split(/\s+/)[0].toLowerCase();
    if (name === "clear") return setLines([]);
    if (name === "exit") return close();

    setLines((current) => [
      ...current,
      {
        id: nextId.current++,
        content: (
          <span>
            <span className="text-ok">{PROMPT}</span> {raw}
          </span>
        ),
      },
      { id: nextId.current++, content: runCommand(name, t) },
    ]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isTerminalHotkey(event.nativeEvent) || event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      setInput(history.navigate(event.key === "ArrowUp" ? "up" : "down"));
    }
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={t.terminal.title}
      aria-hidden={!isOpen}
      inert={!isOpen}
      style={{ visibility: "hidden" }}
      className="fixed inset-x-0 top-0 z-80 h-[55svh] shadow-2xl"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <Window className="h-full border-x-0 border-t-0 border-b-accent/60 bg-panel/95 backdrop-blur-md">
        <Window.Bar className="py-2.5">
          <Window.Title>{t.terminal.title}</Window.Title>
          <span className="ml-auto hidden sm:inline">{t.terminal.hint}</span>
          <button type="button" onClick={close} className="ml-3 px-1 hover:text-accent" aria-label={t.terminal.close}>
            ✕
          </button>
        </Window.Bar>
        <Window.Body ref={outputRef} className="h-[calc(100%-2.5rem)] space-y-1 overflow-y-auto p-4 text-foreground">
          <p className="text-muted">{t.terminal.welcome}</p>
          {lines.map((line) => (
            <div key={line.id} className="break-words">
              {line.content}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor="terminal-input" className="shrink-0 text-ok">
              {PROMPT}
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              tabIndex={isOpen ? 0 : -1}
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-foreground caret-accent outline-none"
            />
          </form>
        </Window.Body>
      </Window>
    </div>
  );
}
