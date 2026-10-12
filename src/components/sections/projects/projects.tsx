"use client";

import { useRef } from "react";
import { Backdrop } from "@/components/ui/backdrop";
import { Section } from "@/components/ui/section";
import { sectionIds, siteConfig } from "@/config/site";
import { useLanguage } from "@/i18n";
import { DESKTOP, gsap, MOBILE, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { pad } from "@/lib/utils";
import { ProjectCard, ProjectsMoreCard } from "./project-card";
import { ScrollHint } from "./scroll-hint";

const PIN_ID = "projects-pin";

export function Projects() {
  const { t } = useLanguage();
  const { projects } = t;
  const total = projects.items.length;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const mm = gsap.matchMedia();

      // Desktop: the section pins at the top and the cards scroll horizontally.
      mm.add(DESKTOP, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
        const visibleAtStart = cards.filter((card) => card.getBoundingClientRect().left < window.innerWidth);
        const offscreen = cards.filter((card) => !visibleAtStart.includes(card));
        const enter = { trigger: sectionRef.current, start: "top 65%" };

        gsap.from(visibleAtStart, {
          y: 60,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: enter,
        });
        gsap.from("[data-scroll-hint]", { y: 16, autoAlpha: 0, duration: 0.7, delay: 0.4, scrollTrigger: enter });
        gsap.to("[data-hint-arrow]", { x: 8, duration: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut" });

        // Guards against a stale instance surviving a hot reload.
        ScrollTrigger.getById(PIN_ID)?.kill(true);
        gsap.set(track, { x: 0 });

        // Scroll distance ends exactly at the right edge of the last card.
        const distance = () => {
          const last = track.lastElementChild as HTMLElement | null;
          if (!last) return 0;
          const end = last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(track).paddingRight);
          return Math.max(0, end - window.innerWidth);
        };

        const horizontalScroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            id: PIN_ID,
            trigger: "[data-projects-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              gsap.set("[data-scroll-progress-bar]", { scaleX: progress });
              if (counterRef.current) {
                counterRef.current.textContent = pad(Math.min(total, Math.floor(progress * (total - 1)) + 1));
              }
            },
          },
        });

        offscreen.forEach((card) => {
          gsap.from(card, {
            y: 60,
            autoAlpha: 0,
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: { trigger: card, containerAnimation: horizontalScroll, start: "left 98%" },
          });
        });
      });

      // Mobile and tablet: a regular vertical list.
      mm.add(MOBILE, () => {
        gsap.utils.toArray<HTMLElement>("[data-project-card]").forEach((card) => {
          gsap.from(card, {
            y: 40,
            autoAlpha: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 92%" },
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <Section ref={sectionRef} id={sectionIds.projects} className="overflow-hidden py-0">
      <Backdrop>
        <Backdrop.Watermark>04</Backdrop.Watermark>
      </Backdrop>

      <div data-projects-pin className="flex flex-col justify-center py-28 lg:h-svh lg:py-0 lg:pt-16">
        <Section.Container>
          <Section.Header title={projects.title} />
        </Section.Container>

        <div
          ref={trackRef}
          className="relative flex flex-col gap-6 px-4 sm:px-6 lg:-mt-4 lg:w-max lg:flex-row lg:pr-[10vw] lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
        >
          {projects.items.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              total={total}
              labels={{
                live: projects.live,
                code: projects.code,
                private: projects.private,
                stack: t.experience.stack,
              }}
            />
          ))}
          <ProjectsMoreCard href={siteConfig.links.github}>{projects.seeAll} ↗</ProjectsMoreCard>
        </div>

        <ScrollHint label={projects.scrollHint} total={total} counterRef={counterRef} />
      </div>
    </Section>
  );
}
