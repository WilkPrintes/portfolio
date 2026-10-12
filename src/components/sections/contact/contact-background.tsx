"use client";

import { useRef } from "react";
import { useLoopWhileVisible } from "@/hooks/use-loop-while-visible";
import { gsap } from "@/lib/gsap";

const RINGS = 3;

/** Rings pulsing out from the center, like a signal being sent. */
export function ContactBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useLoopWhileVisible(ref, () => [
    gsap.fromTo(
      gsap.utils.toArray("[data-ring]", ref.current),
      { scale: 0.4, opacity: 0.6 },
      { scale: 1.6, opacity: 0, duration: 4, ease: "power1.out", stagger: { each: 4 / RINGS, repeat: -1 } },
    ),
  ]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute top-1/3 left-1/2 -translate-1/2">
        {Array.from({ length: RINGS }, (_, ring) => (
          <span
            key={ring}
            data-ring
            className="absolute top-1/2 left-1/2 size-[520px] -translate-1/2 rounded-full border border-accent/30"
          />
        ))}
      </div>
    </div>
  );
}
