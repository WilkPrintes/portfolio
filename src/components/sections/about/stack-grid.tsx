"use client";

import { useRef } from "react";
import { FINE_POINTER, gsap, MOTION_OK, SCRAMBLE_CHARS, useGSAP } from "@/lib/gsap";
import { pad } from "@/lib/utils";
import { StackCard } from "./stack-card";

type SkillGroup = { group: string; items: string[] };

const CHIP_IDLE = { borderColor: "rgb(40 40 45)", color: "#9b9ba3" };
const CHIP_ACTIVE = { borderColor: "rgb(255 176 0 / 0.8)", color: "#ffcf66" };
const PROXIMITY_RADIUS = 160;

export function StackGrid({ groups, itemsLabel }: { groups: SkillGroup[]; itemsLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-stack-card]").forEach((card, index) => {
          const count = card.querySelector<HTMLElement>("[data-stack-count]");
          const counter = { value: 0 };

          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 88%" }, delay: (index % 3) * 0.1 })
            .from(card, { y: 50, autoAlpha: 0, duration: 0.9, ease: "expo.out" })
            .from(card.querySelector("[data-stack-topline]"), { scaleX: 0, duration: 0.9, ease: "expo.inOut" }, "-=0.6")
            .fromTo(
              card.querySelector("[data-stack-scan]"),
              { xPercent: -100 },
              { xPercent: 400, duration: 1.2, ease: "power2.inOut" },
              "<",
            )
            .to(
              card.querySelector("[data-stack-group]"),
              { scrambleText: { text: "{original}", chars: SCRAMBLE_CHARS, speed: 0.5 }, duration: 0.8 },
              "<",
            )
            .to(
              counter,
              {
                value: Number(count?.dataset.stackCount ?? 0),
                duration: 0.8,
                ease: "power2.out",
                onUpdate: () => {
                  if (count) count.textContent = pad(Math.round(counter.value));
                },
              },
              "<",
            )
            .from(
              card.querySelectorAll("[data-stack-chip]"),
              { y: 14, autoAlpha: 0, duration: 0.45, ease: "back.out(2)", stagger: 0.035 },
              "-=0.6",
            );
        });
      });

      // Chips near the pointer grow and light up.
      mm.add(FINE_POINTER, () => {
        const area = ref.current;
        if (!area || !contextSafe) return;
        const chips = gsap.utils.toArray<HTMLElement>("[data-stack-chip]", area);

        const onPointerMove = contextSafe((event: PointerEvent) => {
          chips.forEach((chip) => {
            const rect = chip.getBoundingClientRect();
            const distance = Math.hypot(
              event.clientX - (rect.left + rect.width / 2),
              event.clientY - (rect.top + rect.height / 2),
            );
            const strength = Math.max(0, 1 - distance / PROXIMITY_RADIUS);
            gsap.to(chip, {
              scale: 1 + strength * 0.18,
              ...(strength > 0.5 ? CHIP_ACTIVE : CHIP_IDLE),
              duration: 0.3,
              overwrite: "auto",
            });
          });
        });
        const onPointerLeave = contextSafe(() => {
          gsap.to(chips, { scale: 1, ...CHIP_IDLE, duration: 0.4, overwrite: "auto" });
        });

        area.addEventListener("pointermove", onPointerMove);
        area.addEventListener("pointerleave", onPointerLeave);
        return () => {
          area.removeEventListener("pointermove", onPointerMove);
          area.removeEventListener("pointerleave", onPointerLeave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, index) => (
        <StackCard
          key={group.group}
          index={index}
          group={group.group}
          items={group.items}
          itemsLabel={itemsLabel}
          className={index === 0 ? "md:col-span-2" : undefined}
        />
      ))}
    </div>
  );
}
