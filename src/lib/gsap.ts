"use client";

import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrambleTextPlugin, useGSAP);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(pointer: fine) and (prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const MOBILE = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

export const SCRAMBLE_CHARS = "01<>/{}[]#*+=";

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export { gsap, ScrollTrigger, useGSAP };

/**
 * Smoothly scrolls the window with GSAP. CSS `scroll-behavior: smooth` is disabled while the
 * tween runs; otherwise every frame starts a native smooth scroll and the two fight each other.
 */
export function scrollToTarget(target: number | Element, offsetY = 0) {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;

  return gsap.to(window, {
    scrollTo: { y: target, offsetY },
    duration: prefersReducedMotion() ? 0 : 1.2,
    ease: "expo.inOut",
    overwrite: true,
    onStart: () => {
      root.style.scrollBehavior = "auto";
    },
    onComplete: () => {
      root.style.scrollBehavior = previous;
    },
    onInterrupt: () => {
      root.style.scrollBehavior = previous;
    },
  });
}
