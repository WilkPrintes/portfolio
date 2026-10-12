"use client";

import { useRef } from "react";
import { useLoopWhileVisible } from "@/hooks/use-loop-while-visible";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Two oversized bands of technologies scrolling on their own, in opposite directions. */
export function StackMarquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useLoopWhileVisible(ref, () =>
    gsap.utils
      .toArray<HTMLElement>("[data-band]", ref.current)
      .map((band, index) =>
        gsap.fromTo(
          band,
          { xPercent: index % 2 ? -50 : 0 },
          { xPercent: index % 2 ? 0 : -50, duration: 60, ease: "none", repeat: -1 },
        ),
      ),
  );

  return (
    <div ref={ref} aria-hidden="true" className="mb-10 space-y-2 overflow-hidden">
      {[0, 1].map((band) => (
        <div
          key={band}
          data-band
          className={cn(
            "flex w-max text-5xl font-semibold tracking-tight whitespace-nowrap sm:text-7xl",
            band ? "text-transparent [-webkit-text-stroke:1px_rgb(255_176_0/0.5)]" : "text-foreground/10",
          )}
        >
          {/* Duplicated content makes the -50% loop seamless. */}
          {[...items, ...items].map((item, index) => (
            <span key={index} className="pr-10">
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
