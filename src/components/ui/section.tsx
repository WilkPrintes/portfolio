"use client";

import { useRef, type ComponentProps } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { SplitWords } from "./split-text";

/** Page section. Children can include a `<Backdrop />`, which sits behind the content. */
function SectionRoot({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("relative isolate scroll-mt-20 py-28", className)} {...props} />;
}

function SectionContainer({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

type SectionHeaderProps = {
  index: string;
  title: string;
  subtitle?: string;
  className?: string;
};

function SectionHeader({ index, title, subtitle, className }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%" } })
          .from("[data-label]", { y: 12, autoAlpha: 0, duration: 0.5, ease: "power3.out" })
          .from("[data-word]", { yPercent: 110, stagger: 0.06, duration: 0.9, ease: "expo.out" }, "-=0.3")
          .from("[data-rule]", { scaleX: 0, duration: 1.1, ease: "expo.inOut" }, "-=0.7");
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("mb-14", className)}>
      <p data-label className="mb-4 font-mono text-sm text-accent">
        {index} {subtitle && <span className="text-muted">/ {subtitle}</span>}
      </p>
      <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
        <SplitWords text={title} />
      </h2>
      <div data-rule className="mt-6 h-px origin-left bg-linear-to-r from-accent via-line to-transparent" />
    </div>
  );
}

/** Smaller heading inside a section, styled as a code comment. */
function SectionSubheading({ className, children, ...props }: ComponentProps<"h3">) {
  return (
    <h3 className={cn("mt-28 mb-6 font-mono text-sm text-accent", className)} {...props}>
      {"// "}
      <span className="text-muted">{children}</span>
    </h3>
  );
}

export const Section = Object.assign(SectionRoot, {
  Container: SectionContainer,
  Header: SectionHeader,
  Subheading: SectionSubheading,
});
