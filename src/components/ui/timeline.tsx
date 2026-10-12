"use client";

import { useRef, type ComponentProps } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Vertical timeline whose line is drawn as the user scrolls. */
function TimelineRoot({ className, children, ...props }: ComponentProps<"ol">) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-timeline-progress]", {
          scaleY: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 70%", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className={cn("relative", className)} {...props}>
      <li aria-hidden="true" className="absolute top-2 bottom-0 left-[5px] w-px bg-line">
        <span data-timeline-progress className="block h-full w-full origin-top bg-accent" />
      </li>
      {children}
    </ol>
  );
}

type TimelineItemProps = ComponentProps<"li"> & { highlighted?: boolean };

function TimelineItem({ highlighted, className, children, ...props }: TimelineItemProps) {
  return (
    <li className={cn("relative pb-16 pl-10 last:pb-0", className)} {...props}>
      <span
        aria-hidden="true"
        data-timeline-dot
        className={cn(
          "absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-ink",
          highlighted ? "bg-accent" : "bg-muted",
        )}
      />
      {children}
    </li>
  );
}

export const Timeline = Object.assign(TimelineRoot, { Item: TimelineItem });
