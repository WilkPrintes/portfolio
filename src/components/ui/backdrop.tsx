"use client";

import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";
import { useLoopWhileVisible } from "@/hooks/use-loop-while-visible";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Side = "left" | "right";

const BackdropContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

function useBackdropRef() {
  const ref = useContext(BackdropContext);
  if (!ref) throw new Error("Backdrop.* must be rendered inside <Backdrop>");
  return ref;
}

/** Scroll-linked parallax for a decorative layer, relative to the whole backdrop. */
function useParallax(target: RefObject<Element | null>, from: number, to: number) {
  const root = useBackdropRef();
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        target.current,
        { yPercent: from },
        {
          yPercent: to,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  });
}

/** Decorative layer placed behind a section's content. The section needs `relative isolate`. */
function BackdropRoot({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <BackdropContext value={ref}>
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      >
        {children}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line to-transparent" />
      </div>
    </BackdropContext>
  );
}

/** Oversized outlined number behind the section, e.g. "01". */
function BackdropWatermark({ children, side = "right" }: { children: string; side?: Side }) {
  const ref = useRef<HTMLSpanElement>(null);
  useParallax(ref, 25, -25);

  return (
    <span
      ref={ref}
      className={cn(
        "absolute top-10 text-[16rem] leading-none font-bold tracking-tighter text-transparent select-none [-webkit-text-stroke:1px_rgb(255_255_255/0.06)] sm:text-[24rem]",
        side === "right" ? "-right-6" : "-left-6",
      )}
    >
      {children}
    </span>
  );
}

const ORBIT_RADII = [110, 170, 230, 290];

/** Dashed orbits rotating slowly, like a drafting compass. */
function BackdropOrbits({ side = "right" }: { side?: Side }) {
  const ref = useRef<SVGSVGElement>(null);
  useLoopWhileVisible(ref, () =>
    gsap.utils.toArray<SVGGElement>("[data-orbit]", ref.current).map((orbit, index) =>
      gsap.to(orbit, {
        rotation: index % 2 ? -360 : 360,
        svgOrigin: "300 300",
        duration: 60 + index * 30,
        ease: "none",
        repeat: -1,
      }),
    ),
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 600"
      className={cn(
        "absolute top-1/2 size-[720px] -translate-y-1/2 opacity-70 sm:size-[900px]",
        side === "right" ? "-right-48" : "-left-48",
      )}
    >
      {ORBIT_RADII.map((radius, index) => {
        const isAccent = index === 1;
        return (
          <g key={radius} data-orbit>
            <circle
              cx="300"
              cy="300"
              r={radius}
              fill="none"
              stroke={isAccent ? "rgb(255 176 0 / 0.22)" : "rgb(255 255 255 / 0.07)"}
              strokeDasharray={index % 2 ? "2 8" : "14 10"}
            />
            <circle
              cx={300 + radius}
              cy="300"
              r={isAccent ? 4 : 2.5}
              fill={isAccent ? "#ffb000" : "rgb(255 255 255 / 0.4)"}
            />
          </g>
        );
      })}
      <line x1="300" y1="0" x2="300" y2="600" stroke="rgb(255 255 255 / 0.05)" />
      <line x1="0" y1="300" x2="600" y2="300" stroke="rgb(255 255 255 / 0.05)" />
      <circle cx="300" cy="300" r="3" fill="rgb(255 176 0 / 0.6)" />
    </svg>
  );
}

export const Backdrop = Object.assign(BackdropRoot, {
  Watermark: BackdropWatermark,
  Orbits: BackdropOrbits,
});
