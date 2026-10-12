"use client";

import { useRef } from "react";
import { Backdrop } from "@/components/ui/backdrop";
import { Section } from "@/components/ui/section";
import { sectionIds } from "@/config/site";
import { useLanguage } from "@/i18n";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { EducationCard } from "./education-card";
import { StudyTimeline } from "./study-timeline";

export function Education() {
  const { t } = useLanguage();
  const { education } = t;
  const ref = useRef<HTMLDivElement>(null);
  const firstYear = Math.min(...education.items.map((item) => item.start));
  const lastYear = Math.max(...education.items.map((item) => item.end));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-study-timeline]", start: "top 85%" } })
          .from("[data-axis]", { scaleX: 0, duration: 1.2, ease: "expo.inOut" })
          .from("[data-year]", { y: 10, autoAlpha: 0, stagger: 0.06, duration: 0.4 }, "-=0.8")
          .from("[data-bar]", { scaleX: 0, stagger: 0.25, duration: 1, ease: "expo.out" }, "-=0.4")
          .from("[data-bar-label]", { autoAlpha: 0, y: 6, stagger: 0.25, duration: 0.4 }, "-=0.8");

        gsap.utils.toArray<HTMLElement>("[data-education-card]").forEach((card, index) => {
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 85%" } })
            .from(card, { x: index % 2 ? 60 : -60, autoAlpha: 0, duration: 1, ease: "expo.out" })
            .to(
              card.querySelector("[data-education-place]"),
              { scrambleText: { text: "{original}", chars: "01<>/{}#", speed: 0.5 }, duration: 0.8 },
              "-=0.6",
            )
            .from(
              card.querySelectorAll("[data-education-topic]"),
              { y: 12, autoAlpha: 0, stagger: 0.06, duration: 0.45, ease: "back.out(2)" },
              "-=0.4",
            )
            .from(
              card.querySelectorAll("[data-education-project]"),
              {
                scale: 0.7,
                autoAlpha: 0,
                stagger: { each: 0.05, from: "random" },
                duration: 0.4,
                ease: "back.out(2.5)",
              },
              "-=0.3",
            );
        });
      });
    },
    { scope: ref },
  );

  return (
    <Section id={sectionIds.education} className="overflow-hidden">
      <Backdrop>
        <Backdrop.Orbits />
        <Backdrop.Watermark side="left">03</Backdrop.Watermark>
      </Backdrop>

      <Section.Container ref={ref}>
        <Section.Header title={education.title} />
        <StudyTimeline items={education.items} from={firstYear} to={lastYear} />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[3fr_2fr]">
          {education.items.map((item) => (
            <EducationCard
              key={item.place}
              item={item}
              topicsLabel={education.topicsLabel}
              projectsLabel={education.projectsLabel}
            />
          ))}
        </div>
      </Section.Container>
    </Section>
  );
}
