"use client";

import { useEffect, type RefObject } from "react";

/**
 * Mirrors the pointer position inside an element into the `--mx` / `--my` CSS variables,
 * used by spotlight effects (see `<Spotlight />`).
 */
export function usePointerVars(ref: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      element.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    element.addEventListener("pointermove", onPointerMove);
    return () => element.removeEventListener("pointermove", onPointerMove);
  }, [ref, enabled]);
}
