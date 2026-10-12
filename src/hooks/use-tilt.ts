"use client";

import type { RefObject } from "react";
import { FINE_POINTER, gsap, useGSAP } from "@/lib/gsap";

/** Tilts an element in 3D towards the pointer. */
export function useTilt(ref: RefObject<HTMLElement | null>, maxDegrees = 8) {
  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const mm = gsap.matchMedia();
      mm.add(FINE_POINTER, () => {
        gsap.set(element, { transformPerspective: 1000 });
        const rotateX = gsap.quickTo(element, "rotationX", { duration: 0.6, ease: "power3.out" });
        const rotateY = gsap.quickTo(element, "rotationY", { duration: 0.6, ease: "power3.out" });

        const onPointerMove = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          rotateY(((event.clientX - rect.left) / rect.width - 0.5) * maxDegrees);
          rotateX(-((event.clientY - rect.top) / rect.height - 0.5) * maxDegrees);
        };
        const onPointerLeave = () => {
          rotateX(0);
          rotateY(0);
        };

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
}
