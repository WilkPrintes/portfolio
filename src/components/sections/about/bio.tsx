"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Paragraphs that light up word by word as they scroll in, finishing before mid-screen. */
export function Bio({ paragraphs }: { paragraphs: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-paragraph]").forEach((paragraph) => {
          gsap.fromTo(
            paragraph.querySelectorAll("[data-bio-word]"),
            { opacity: 0.25 },
            {
              opacity: 1,
              stagger: 0.05,
              ease: "none",
              scrollTrigger: { trigger: paragraph, start: "top 98%", end: "bottom 78%", scrub: 0.4 },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="space-y-5 text-xl leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} data-paragraph aria-label={paragraph}>
          {paragraph.split(" ").map((word, index) => (
            <span key={index} data-bio-word aria-hidden="true">
              {word}{" "}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
