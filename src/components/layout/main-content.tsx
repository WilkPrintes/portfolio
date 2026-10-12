"use client";

import { useRef, type ReactNode } from "react";
import { useLanguage } from "@/i18n";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** `<main>` wrapper that fades the page and recomputes scroll positions on language change. */
export function MainContent({ children }: { children: ReactNode }) {
  const { locale } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      ScrollTrigger.refresh();
      gsap.fromTo(ref.current, { autoAlpha: 0.4 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
    },
    { dependencies: [locale] },
  );

  return <main ref={ref}>{children}</main>;
}
