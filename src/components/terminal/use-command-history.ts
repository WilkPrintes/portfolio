"use client";

import { useCallback, useState } from "react";

/** Shell-like history navigation with the arrow keys. */
export function useCommandHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);

  const push = useCallback((command: string) => {
    setHistory((current) => [command, ...current]);
    setCursor(-1);
  }, []);

  const navigate = useCallback(
    (direction: "up" | "down") => {
      const next = direction === "up" ? Math.min(cursor + 1, history.length - 1) : Math.max(cursor - 1, -1);
      setCursor(next);
      return next === -1 ? "" : history[next];
    },
    [cursor, history],
  );

  return { push, navigate };
}
