"use client";

import { useRef, type ReactNode } from "react";
import { FINE_POINTER, gsap, useGSAP } from "@/lib/gsap";

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  /** Maximum offset in pixels, so neighbouring elements never touch. */
  maxOffset?: number;
};

/** Pulls its child slightly towards the pointer. */
export function Magnetic({ children, strength = 0.18, maxOffset = 8 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const element = ref.current;
      if (!element || !contextSafe) return;

      const mm = gsap.matchMedia();
      mm.add(FINE_POINTER, () => {
        const clamp = gsap.utils.clamp(-maxOffset, maxOffset);
        const moveX = gsap.quickTo(element, "x", { duration: 0.5, ease: "power3.out" });
        const moveY = gsap.quickTo(element, "y", { duration: 0.5, ease: "power3.out" });

        const onPointerMove = contextSafe((event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          moveX(clamp((event.clientX - rect.left - rect.width / 2) * strength));
          moveY(clamp((event.clientY - rect.top - rect.height / 2) * strength));
        });
        const onPointerLeave = contextSafe(() => {
          gsap.to(element, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
        });

        element.addEventListener("pointermove", onPointerMove);
        element.addEventListener("pointerleave", onPointerLeave);
        return () => {
          element.removeEventListener("pointermove", onPointerMove);
          element.removeEventListener("pointerleave", onPointerLeave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
