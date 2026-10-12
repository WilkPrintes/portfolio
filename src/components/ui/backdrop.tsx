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

function BackdropDots() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] mask-[radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)] bg-size-[22px_22px]" />
  );
}

function BackdropGlows({ side = "right" }: { side?: Side }) {
  const primary = useRef<HTMLDivElement>(null);
  const secondary = useRef<HTMLDivElement>(null);
  useParallax(primary, 30, -40);
  useParallax(secondary, -20, 35);

  return (
    <>
      <div
        ref={primary}
        className={cn(
          "absolute top-[10%] size-[560px] rounded-full bg-accent/8 blur-[120px]",
          side === "right" ? "-right-40" : "-left-40",
        )}
      />
      <div
        ref={secondary}
        className={cn(
          "absolute bottom-0 size-[460px] rounded-full bg-[#7c8cff]/6 blur-[120px]",
          side === "right" ? "-left-32" : "-right-32",
        )}
      />
    </>
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

/** Drafting-table grid with a light sweep and measurement annotations. */
function BackdropBlueprint() {
  const sweep = useRef<HTMLDivElement>(null);
  useLoopWhileVisible(sweep, () => [
    gsap.fromTo(
      sweep.current,
      { xPercent: -120 },
      { xPercent: 420, duration: 7, ease: "power1.inOut", repeat: -1, repeatDelay: 1.5 },
    ),
  ]);

  const mask = "mask-[radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]";

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-size-[24px_24px]",
          mask,
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(rgb(255_176_0/0.09)_1px,transparent_1px),linear-gradient(90deg,rgb(255_176_0/0.09)_1px,transparent_1px)] bg-size-[120px_120px]",
          mask,
        )}
      />
      <div
        ref={sweep}
        className="absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-linear-to-r from-transparent via-accent/7 to-transparent"
      />
      <div className="absolute top-[18%] left-[6%] hidden font-mono text-[10px] text-accent/40 lg:block">
        <span className="block h-px w-40 bg-accent/30" />
        <span className="mt-1 block">x: 0 → 100vw</span>
      </div>
      <div className="absolute right-[5%] bottom-[14%] hidden font-mono text-[10px] text-accent/40 lg:block">
        <span className="ml-auto block h-24 w-px bg-accent/30" />
        <span className="mt-1 block">scroll: pin + scrub</span>
      </div>
    </>
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
  Dots: BackdropDots,
  Glows: BackdropGlows,
  Watermark: BackdropWatermark,
  Blueprint: BackdropBlueprint,
  Orbits: BackdropOrbits,
});
