"use client";

import { useRef } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { usePointerVars } from "@/hooks/use-pointer-vars";
import { FINE_POINTER, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type MetricProps = {
  value: number;
  suffix: string;
  label: string;
  className?: string;
};

/** A number, one "unit" bar per counted item and a label. The intro is driven by `<HeroMetrics />`. */
export function Metric({ value, suffix, label, className }: MetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePointerVars(ref);

  useGSAP(
    (_, contextSafe) => {
      const element = ref.current;
      if (!element || !contextSafe) return;

      const mm = gsap.matchMedia();
      mm.add(FINE_POINTER, () => {
        const onEnter = contextSafe(() => {
          gsap.to("[data-metric-unit]", {
            y: -5,
            duration: 0.18,
            stagger: 0.03,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to("[data-metric-number]", { y: -4, duration: 0.3, ease: "power3.out" });
        });
        const onLeave = contextSafe(() => {
          gsap.to("[data-metric-number]", { y: 0, duration: 0.4, ease: "power3.out" });
        });

        element.addEventListener("pointerenter", onEnter);
        element.addEventListener("pointerleave", onLeave);
        return () => {
          element.removeEventListener("pointerenter", onEnter);
          element.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      data-metric
      className={cn("group relative flex flex-col overflow-hidden px-4 py-5 sm:px-6", className)}
    >
      <span aria-hidden="true" data-metric-topline className="absolute inset-x-0 top-0 h-0.5 origin-left bg-accent" />
      <Spotlight size={220} />
      <dd
        data-metric-number
        className="relative order-1 text-3xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent-soft sm:text-4xl"
      >
        <span data-metric-value={value}>{value}</span>
        <span className="text-accent">{suffix}</span>
      </dd>
      <dd aria-hidden="true" className="relative order-2 mt-2 flex gap-1">
        {Array.from({ length: value }, (_, index) => (
          <span key={index} data-metric-unit className="h-3 w-1.5 origin-bottom rounded-[1px] bg-accent" />
        ))}
      </dd>
      <dt className="relative order-3 mt-2 font-mono text-xs leading-snug text-muted transition-colors duration-300 group-hover:text-foreground">
        {label}
      </dt>
    </div>
  );
}
