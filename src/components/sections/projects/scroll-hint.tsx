import type { RefObject } from "react";
import { pad } from "@/lib/utils";

type ScrollHintProps = {
  label: string;
  total: number;
  counterRef: RefObject<HTMLSpanElement | null>;
};

/** "Scroll to browse" hint with a progress bar and a counter, updated by the pinned scroll. */
export function ScrollHint({ label, total, counterRef }: ScrollHintProps) {
  return (
    <div
      data-scroll-hint
      className="mx-auto mt-8 hidden w-full max-w-6xl items-center gap-4 px-6 font-mono text-xs text-muted lg:flex"
    >
      <span className="flex items-center gap-3 whitespace-nowrap">
        <span aria-hidden="true" className="flex h-7 w-4 justify-center rounded-full border border-muted/60 pt-1.5">
          <span className="h-1.5 w-0.5 animate-bounce rounded-full bg-accent" />
        </span>
        {label}
        <span data-hint-arrow aria-hidden="true" className="text-accent">
          →
        </span>
      </span>
      <span className="h-px flex-1 bg-line">
        <span data-scroll-progress-bar className="block h-full origin-left scale-x-0 bg-accent" />
      </span>
      <span className="whitespace-nowrap">
        <span ref={counterRef} className="text-foreground">
          {pad(1)}
        </span>{" "}
        / {pad(total)}
      </span>
    </div>
  );
}
