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
