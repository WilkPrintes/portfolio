"use client";

import { useRef, type ComponentProps } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { SplitChars } from "./split-text";

/** Page section. Children can include a `<Backdrop />`, which sits behind the content. */
function SectionRoot({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("relative isolate scroll-mt-20 py-28", className)} {...props} />;
}

function SectionContainer({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

type SectionHeaderProps = {
  title: string;
  className?: string;
};

function SectionHeader({ title, className }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-rule]", {
          scaleX: 0,
          duration: 1.1,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });

        // Letters float up into place as the title scrolls in (React Bits' ScrollFloat effect).
        gsap.fromTo(
          "[data-char]",
          { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: 0.7, transformOrigin: "50% 0%" },
          {
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger: 0.03,
            ease: "back.inOut(2)",
            scrollTrigger: { trigger: ref.current, start: "top bottom-=5%", end: "top 55%", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("mb-14", className)}>
      <h2 className="overflow-hidden pb-2 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
        <SplitChars text={title} />
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
