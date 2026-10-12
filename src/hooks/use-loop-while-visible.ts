"use client";

import type { RefObject } from "react";
import { MOTION_OK, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Creates infinite GSAP animations that only run while `ref` is on screen,
 * so decorative loops never cost anything off-screen.
 */
export function useLoopWhileVisible(ref: RefObject<Element | null>, createLoops: () => gsap.core.Animation[]) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loops = createLoops();
        loops.forEach((loop) => loop.pause());
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => loops.forEach((loop) => (isActive ? loop.play() : loop.pause())),
        });
      });
    },
    { scope: ref },
  );
}
