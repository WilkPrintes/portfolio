"use client";

import { useRef } from "react";
import { useLoopWhileVisible } from "@/hooks/use-loop-while-visible";
import { gsap } from "@/lib/gsap";

const FLOOR_WIDTH = 1200;
const FLOOR_HEIGHT = 360;
const FLOOR_ROWS = 14;
const FLOOR_COLUMNS = Array.from({ length: 25 }, (_, index) => -1800 + index * 200);

/** Vertical position of a floor line: lines bunch up towards the horizon. */
const rowY = (t: number) => FLOOR_HEIGHT * Math.pow(t, 2.2);
const rowOpacity = (t: number) => 0.08 + t * 0.4;

/**
 * Glow, pulsing rings and a perspective floor that keeps moving forward.
 * The floor is drawn in flat SVG: rotating a CSS grid in 3D aliases thin lines.
 */
export function ContactBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useLoopWhileVisible(ref, () => {
    const rows = gsap.utils.toArray<SVGLineElement>("[data-floor-row]", ref.current);
    const floor = { phase: 0 };

    return [
      gsap.to(floor, {
        phase: 1,
        duration: 1.8,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          rows.forEach((row, index) => {
            const t = (index + floor.phase) / FLOOR_ROWS;
            const y = rowY(t).toFixed(2);
            row.setAttribute("y1", y);
            row.setAttribute("y2", y);
            row.setAttribute("stroke-opacity", rowOpacity(t).toFixed(3));
          });
        },
      }),
      gsap.fromTo(
        gsap.utils.toArray("[data-ring]", ref.current),
        { scale: 0.4, opacity: 0.6 },
        { scale: 1.6, opacity: 0, duration: 4, ease: "power1.out", stagger: { each: 1.33, repeat: -1 } },
      ),
      gsap.to(gsap.utils.toArray("[data-glow]", ref.current), {
        scale: 1.2,
        opacity: 0.9,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }),
    ];
  });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div
        data-glow
        className="absolute top-1/3 left-1/2 size-[520px] -translate-1/2 rounded-full bg-accent/12 opacity-60 blur-[120px]"
      />
      <div className="absolute top-1/3 left-1/2 -translate-1/2">
        {[0, 1, 2].map((ring) => (
          <span
            key={ring}
            data-ring
            className="absolute top-1/2 left-1/2 size-[520px] -translate-1/2 rounded-full border border-accent/30"
          />
        ))}
      </div>

      <svg
        viewBox={`0 0 ${FLOOR_WIDTH} ${FLOOR_HEIGHT}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-1/2 w-full mask-[linear-gradient(to_bottom,transparent,black_35%)]"
      >
        {FLOOR_COLUMNS.map((x) => (
          <line
            key={x}
            x1={FLOOR_WIDTH / 2}
            y1="0"
            x2={x + FLOOR_WIDTH / 2}
            y2={FLOOR_HEIGHT}
            stroke="#ffb000"
            strokeOpacity="0.22"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {Array.from({ length: FLOOR_ROWS }, (_, index) => {
          const t = index / FLOOR_ROWS;
          return (
            <line
              key={index}
              data-floor-row
              x1="0"
              x2={FLOOR_WIDTH}
              y1={rowY(t)}
              y2={rowY(t)}
              stroke="#ffb000"
              strokeOpacity={rowOpacity(t)}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        <line
          x1="0"
          x2={FLOOR_WIDTH}
          y1="0.5"
          y2="0.5"
          stroke="#ffb000"
          strokeOpacity="0.35"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink to-transparent" />
    </div>
  );
}
