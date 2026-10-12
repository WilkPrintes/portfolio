"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitChars } from "@/components/ui/split-text";
import { sectionIds } from "@/config/site";
import { useLanguage } from "@/i18n";
import { gsap, MOTION_OK, REDUCED_MOTION, useGSAP } from "@/lib/gsap";
import { EngineDebugPanel } from "./engine-debug-panel";
import { HeroMetrics } from "./hero-metrics";
import { RaycastScene } from "./raycast-scene";

export function Hero() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, reduce: REDUCED_MOTION }, (context) => {
        gsap.set("[data-hero-content]", { autoAlpha: 1 });
        if (!context.conditions?.motion) return;

        const roleLength = ref.current?.querySelector("[data-hero-role]")?.textContent?.length ?? 30;

        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-hero-scene]", { autoAlpha: 0, scale: 1.12, duration: 1.8, ease: "power2.out" })
          .from("[data-hero-greeting]", { y: 16, autoAlpha: 0, duration: 0.7 }, 0.3)
          .from("[data-hero-name] [data-char]", { yPercent: 110, autoAlpha: 0, stagger: 0.03, duration: 1 }, 0.4)
          .from(
            "[data-hero-role]",
            { width: 0, duration: roleLength * 0.035, ease: `steps(${roleLength})`, clearProps: "width" },
            0.9,
          )
          .from("[data-hero-tagline]", { y: 20, autoAlpha: 0, duration: 0.9 }, 1.1)
          .from("[data-hero-cta] > *", { y: 16, autoAlpha: 0, stagger: 0.1, duration: 0.8 }, 1.25)
          .from(
            "[data-hero-debug]",
            { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 0, duration: 1, ease: "expo.inOut" },
            1,
          );

        const scrollTrigger = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-content]", { yPercent: -15, autoAlpha: 0, ease: "none", scrollTrigger });
        gsap.to("[data-hero-parallax]", { scale: 1.12, ease: "none", scrollTrigger });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id={sectionIds.hero} className="relative flex min-h-svh flex-col overflow-hidden">
      <div data-hero-parallax className="absolute inset-0">
        <div data-hero-scene className="absolute inset-0 opacity-70">
          <RaycastScene minimapRef={minimapRef} statsRef={statsRef} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-ink via-ink/80 to-ink/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-ink to-transparent" />

      <div
        data-hero-content
        className="invisible relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 pt-28 pb-8 sm:px-6 lg:grid-cols-[1fr_auto]"
      >
        <div>
          <p data-hero-greeting className="mb-5 font-mono text-sm text-accent">
            {t.hero.greeting}
          </p>
          <h1 data-hero-name className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            <SplitChars text={t.hero.name} />
          </h1>
          <p className="mt-5 font-mono text-[15px] whitespace-nowrap text-accent-soft sm:text-2xl">
            <span className="text-muted">&gt; </span>
            <span data-hero-role className="inline-block overflow-hidden align-bottom whitespace-nowrap">
              {t.hero.role}
            </span>
            <span className="blink text-accent">▍</span>
          </p>
          <p data-hero-tagline className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
            {t.hero.tagline}
          </p>
          <div data-hero-cta className="mt-10 flex flex-wrap items-center gap-5">
            <Magnetic>
              <ButtonLink href={`#${sectionIds.experience}`} icon="↓">
                {t.hero.ctaPrimary}
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href={`#${sectionIds.contact}`} variant="secondary">
                {t.hero.ctaSecondary}
              </ButtonLink>
            </Magnetic>
          </div>
        </div>

        <EngineDebugPanel
          title={t.hero.debugTitle}
          note={t.hero.debugNote}
          minimapRef={minimapRef}
          statsRef={statsRef}
        />
      </div>

      <div className="relative border-t border-line bg-ink/70 backdrop-blur">
        <HeroMetrics />
      </div>
    </section>
  );
}
