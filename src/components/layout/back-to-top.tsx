"use client";

import { useRef } from "react";
import { useLanguage } from "@/i18n";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SHOW_AFTER = 200;

/** Floating "back to top" button with a reading-progress ring. */
export function BackToTop() {
  const { locale } = useLanguage();
  const ref = useRef<HTMLButtonElement>(null);
  const label = locale === "pt" ? "Voltar ao topo" : "Back to top";

  useGSAP(
    () => {
      const button = ref.current;
      if (!button) return;

      gsap.set(button, { autoAlpha: 0, y: 20, scale: 0.8 });
      gsap.fromTo(
        "[data-progress-ring]",
        { strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE },
        { strokeDashoffset: 0, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
      );

      let visible = false;
      const update = (scrollY: number) => {
        const shouldShow = scrollY > SHOW_AFTER;
        if (shouldShow === visible) return;
        visible = shouldShow;
        gsap.to(button, {
          autoAlpha: shouldShow ? 1 : 0,
          y: shouldShow ? 0 : 20,
          scale: shouldShow ? 1 : 0.8,
          duration: prefersReducedMotion() ? 0 : 0.4,
          ease: shouldShow ? "back.out(2)" : "power2.in",
          overwrite: true,
        });
      };

      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => update(self.scroll()) });
      update(window.scrollY);
    },
    { scope: ref },
  );

  const scrollToTop = () => {
    gsap.to(window, { scrollTo: 0, duration: prefersReducedMotion() ? 0 : 1.2, ease: "expo.inOut" });
    gsap.fromTo("[data-arrow]", { y: 0 }, { y: -6, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      className="group fixed right-5 bottom-5 z-70 flex size-12 items-center justify-center rounded-full border border-line bg-ink/80 text-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent sm:right-8 sm:bottom-8"
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
        <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
        <circle
          data-progress-ring
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="#ffb000"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span data-arrow className="relative font-mono text-lg leading-none">
        ↑
      </span>
    </button>
  );
}
