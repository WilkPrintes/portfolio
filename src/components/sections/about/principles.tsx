"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { gsap, MOTION_OK, SCRAMBLE_CHARS, useGSAP } from "@/lib/gsap";
import { pad } from "@/lib/utils";

type Principle = { title: string; text: string };

export function Principles({ items }: { items: Principle[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-principles-progress]", {
          scaleX: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 60%", scrub: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-principle]").forEach((card, index) => {
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 88%" } })
            .from(card, {
              rotateX: -70,
              y: 50,
              autoAlpha: 0,
              transformPerspective: 900,
              transformOrigin: "50% 0%",
              duration: 1,
              delay: (index % 2) * 0.12,
              ease: "expo.out",
            })
            .to(
              card.querySelector("[data-principle-index]"),
              { scrambleText: { text: "{original}", chars: "0123456789", speed: 0.5 }, duration: 0.6 },
              "-=0.7",
            )
            .to(
              card.querySelector("[data-principle-title]"),
              { scrambleText: { text: "{original}", chars: SCRAMBLE_CHARS, speed: 0.4 }, duration: 1 },
              "<",
            )
            .from(card.querySelector("[data-principle-text]"), { y: 12, autoAlpha: 0, duration: 0.6 }, "-=0.6");
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <div className="mb-6 h-px bg-line">
        <div data-principles-progress className="h-full origin-left bg-accent" />
      </div>
      <ol className="grid gap-4 sm:grid-cols-2">
        {items.map((principle, index) => (
          <li key={principle.title}>
            <Card data-principle className="h-full hover:border-accent/60">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span data-principle-index className="font-mono text-sm text-accent">
                {pad(index + 1)}
              </span>
              <Card.Title data-principle-title className="mt-3">
                {principle.title}
              </Card.Title>
              <Card.Description data-principle-text className="mt-2">
                {principle.text}
              </Card.Description>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
