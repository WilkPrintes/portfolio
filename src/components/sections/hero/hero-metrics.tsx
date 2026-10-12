"use client";

import { useRef } from "react";
import { useLanguage } from "@/i18n";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Metric } from "./metric";

/** Bottom bar of the hero: counters and unit bars light up one metric after another. */
export function HeroMetrics({ delay = 1.3 }: { delay?: number }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const metrics = gsap.utils.toArray<HTMLElement>("[data-metric]");
        const timeline = gsap.timeline({ delay });

        timeline
          .from(metrics, { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: "expo.out" })
          .from("[data-metric-topline]", { scaleX: 0, stagger: 0.18, duration: 0.6, ease: "power2.inOut" }, 0.2);

        metrics.forEach((metric, index) => {
          const valueElement = metric.querySelector<HTMLElement>("[data-metric-value]");
          const units = metric.querySelectorAll("[data-metric-unit]");
          const counter = { value: 0 };
          const startAt = 0.3 + index * 0.18;

          timeline
            .to(
              counter,
              {
                value: Number(valueElement?.dataset.metricValue ?? 0),
                duration: 1.2,
                ease: "power2.out",
                onUpdate: () => {
                  if (valueElement) valueElement.textContent = String(Math.round(counter.value));
                },
              },
              startAt,
            )
            .fromTo(
              units,
              { backgroundColor: "#28282d", scaleY: 0.4 },
              {
                backgroundColor: "#ffb000",
                scaleY: 1,
                stagger: 1.1 / Math.max(units.length, 1),
                duration: 0.25,
                ease: "back.out(3)",
              },
              startAt,
            )
            .fromTo(
              metric.querySelector("[data-metric-number]"),
              { textShadow: "0 0 0px rgb(255 176 0 / 0)" },
              { textShadow: "0 0 24px rgb(255 176 0 / 0.8)", duration: 0.25, yoyo: true, repeat: 1 },
              startAt + 1.1,
            );
        });

        timeline.fromTo(
          "[data-metrics-shine]",
          { xPercent: -100 },
          { xPercent: 500, duration: 1.4, ease: "power2.inOut" },
          "-=0.4",
        );
      });
    },
    { scope: ref },
  );

  return (
    <dl ref={ref} className="relative mx-auto grid max-w-6xl grid-cols-2 overflow-hidden lg:grid-cols-4">
      <span
        aria-hidden="true"
        data-metrics-shine
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/5 -skew-x-12 bg-linear-to-r from-transparent via-accent/15 to-transparent"
      />
      {t.metrics.map((metric, index) => (
        <Metric
          key={metric.label}
          {...metric}
          className={cn(
            index % 2 === 1 && "border-l border-line",
            index > 1 && "border-t border-line lg:border-t-0",
            index === 2 && "lg:border-l",
          )}
        />
      ))}
    </dl>
  );
}
