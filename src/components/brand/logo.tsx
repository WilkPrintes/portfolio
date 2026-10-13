"use client";

import { useRef } from "react";
import { sectionIds, siteConfig } from "@/config/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Corner ticks and the direction each one opens on hover.
const TICKS = [
  { d: "M10 17V10H17", hover: "group-hover:-translate-x-[3px] group-hover:-translate-y-[3px]" },
  { d: "M47 10H54V17", hover: "group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" },
  { d: "M54 47V54H47", hover: "group-hover:translate-x-[3px] group-hover:translate-y-[3px]" },
  { d: "M17 54H10V47", hover: "group-hover:-translate-x-[3px] group-hover:translate-y-[3px]" },
];

export function Logo() {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ delay: 0.8 })
          .fromTo("[data-logo-w]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" })
          .from(
            "[data-logo-tick]",
            { scale: 0, transformOrigin: "50% 50%", stagger: 0.08, duration: 0.4, ease: "back.out(3)" },
            "-=0.5",
          )
          .from("[data-logo-cursor]", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.3 }, "-=0.2")
          .from("[data-logo-text]", { x: -8, autoAlpha: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");

        const el = ref.current;
        if (!el || !contextSafe) return;
        const redraw = contextSafe(() => {
          gsap.fromTo(
            "[data-logo-w]",
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut", overwrite: true },
          );
        });
        el.addEventListener("pointerenter", redraw);
        return () => el.removeEventListener("pointerenter", redraw);
      });
    },
    { scope: ref },
  );

  return (
    <a ref={ref} href={`#${sectionIds.hero}`} aria-label={siteConfig.name} className="group flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-8 w-8 overflow-visible">
        {TICKS.map((tick) => (
          <path
            key={tick.d}
            data-logo-tick
            className={`transition-transform duration-300 ease-out ${tick.hover}`}
            d={tick.d}
            fill="none"
            stroke="#ffb000"
            strokeOpacity="0.55"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
        ))}
        <path
          data-logo-w
          d="M16 21L23.5 42L32 28L40.5 42L48 21"
          pathLength={1}
          strokeDasharray="1"
          fill="none"
          stroke="#ffb000"
          strokeWidth="5.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
        />
        <rect data-logo-cursor className="blink" x="43" y="45" width="7" height="3.5" fill="#ececee" />
      </svg>
      <span data-logo-text className="font-mono text-sm font-medium text-foreground">
        wilkprintes<span className="text-accent">.</span>dev
      </span>
    </a>
  );
}
