"use client";

import { useRef } from "react";
import { DESKTOP, gsap, MOTION_OK, SCRAMBLE_CHARS, useGSAP } from "@/lib/gsap";

type ProfileRow = { label: string; value: string };

/** Key facts in a definition list; labels "decode" when the card enters. */
export function ProfileCard({ rows }: { rows: ProfileRow[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%" } })
          .from("[data-profile]", { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" })
          .from(
            "[data-profile-row]",
            { x: -16, autoAlpha: 0, stagger: 0.07, duration: 0.6, ease: "power3.out" },
            "-=0.4",
          )
          .to(
            "[data-profile-label]",
            { scrambleText: { text: "{original}", chars: SCRAMBLE_CHARS, speed: 0.6 }, duration: 0.8, stagger: 0.07 },
            "<",
          );
      });

      mm.add(DESKTOP, () => {
        gsap.to(ref.current, {
          y: -60,
          ease: "none",
          scrollTrigger: { trigger: ref.current?.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="self-start">
      <dl data-profile className="ticks border border-line bg-panel/80 p-6">
        {rows.map((row) => (
          <div
            key={row.label}
            data-profile-row
            className="border-b border-line py-3 first:pt-0 last:border-0 last:pb-0"
          >
            <dt data-profile-label className="font-mono text-xs tracking-wider text-muted uppercase">
              {row.label}
            </dt>
            <dd className="mt-1 text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
