"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/*
 * Infinite horizontal marquee. Adapted from React Bits' LogoLoop (https://reactbits.dev),
 * trimmed to horizontal node items and paused while off-screen.
 */

const SMOOTH_TAU = 0.25;
const MIN_COPIES = 2;
const COPY_HEADROOM = 2;

export type LogoLoopItem = { key: string; node: ReactNode; label: string };

type LogoLoopProps = {
  items: LogoLoopItem[];
  /** Pixels per second. Negative values scroll to the right. */
  speed?: number;
  /** Speed while hovered (0 pauses). */
  hoverSpeed?: number;
  gap?: number;
  ariaLabel: string;
  className?: string;
};

export function LogoLoop({ items, speed = 60, hoverSpeed = 15, gap = 48, ariaLabel, className }: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLUListElement>(null);
  const [sequenceWidth, setSequenceWidth] = useState(0);
  const [copies, setCopies] = useState(MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);
  // Kept across effect runs so hovering changes speed without jumping back to the start.
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  const measure = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const width = sequenceRef.current?.getBoundingClientRect().width ?? 0;
    if (width === 0) return;
    setSequenceWidth(Math.ceil(width));
    setCopies(Math.max(MIN_COPIES, Math.ceil(containerWidth / width) + COPY_HEADROOM));
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    if (sequenceRef.current) observer.observe(sequenceRef.current);
    measure();
    return () => observer.disconnect();
  }, [measure, items, gap]);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || sequenceWidth === 0 || prefersReducedMotion()) return;

    let frameId = 0;
    let lastTime: number | null = null;
    let isVisible = true;
    const target = isHovered ? hoverSpeed : speed;

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      lastTime = null;
    });
    visibilityObserver.observe(container);

    const animate = (time: number) => {
      if (isVisible) {
        const dt = lastTime === null ? 0 : Math.max(0, time - lastTime) / 1000;
        lastTime = time;
        velocityRef.current += (target - velocityRef.current) * (1 - Math.exp(-dt / SMOOTH_TAU));
        const next = offsetRef.current + velocityRef.current * dt;
        offsetRef.current = ((next % sequenceWidth) + sequenceWidth) % sequenceWidth;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      visibilityObserver.disconnect();
    };
  }, [sequenceWidth, isHovered, speed, hoverSpeed]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      className={cn("relative overflow-x-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-ink to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-ink to-transparent"
      />

      <div ref={trackRef} className="flex w-max will-change-transform select-none">
        {Array.from({ length: copies }, (_, copy) => (
          <ul
            key={copy}
            ref={copy === 0 ? sequenceRef : undefined}
            aria-hidden={copy > 0}
            className="flex items-center"
          >
            {items.map((item) => (
              <li
                key={item.key}
                aria-label={copy === 0 ? item.label : undefined}
                className="flex-none"
                style={{ marginRight: gap }}
              >
                {item.node}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
