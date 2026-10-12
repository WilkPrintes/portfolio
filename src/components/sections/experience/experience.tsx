"use client";

import { useRef, useState } from "react";
import { Section } from "@/components/ui/section";
import { sectionIds } from "@/config/site";
import { useLanguage } from "@/i18n";
import { DESKTOP, gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { ExperienceNav } from "./experience-nav";
import { JobCard } from "./job-card";

export function Experience() {
  const { t } = useLanguage();
  const { experience } = t;
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-experience-item]");

      // The job crossing the middle of the screen becomes the active one.
      items.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: ({ isActive }) => isActive && setActiveIndex(index),
        });
      });

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        items.forEach((item) => {
          gsap
            .timeline({ scrollTrigger: { trigger: item, start: "top 82%" } })
            .from(item.querySelector("[data-job-card]"), {
              clipPath: "inset(0% 0% 100% 0%)",
              y: 60,
              duration: 1.1,
              ease: "expo.out",
            })
            .from(
              item.querySelector("[data-job-logo]"),
              { scale: 0, rotate: -20, duration: 0.6, ease: "back.out(2.5)" },
              "-=0.8",
            )
            .from(
              item.querySelectorAll("[data-job-highlight]"),
              { x: 24, autoAlpha: 0, stagger: 0.08, duration: 0.55, ease: "power3.out" },
              "-=0.6",
            )
            .from(
              item.querySelectorAll("[data-tech-icon]"),
              { y: 10, autoAlpha: 0, scale: 0.8, stagger: 0.04, duration: 0.4, ease: "back.out(2)" },
              "-=0.3",
            );
        });
      });

      // Desktop: the sticky rail fills up as the reader moves through the jobs.
      mm.add(DESKTOP, () => {
        gsap.to("[data-experience-progress]", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-experience-list]", start: "top 55%", end: "bottom 55%", scrub: 0.3 },
        });
        gsap.from("[data-experience-nav] li", {
          x: -20,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-experience-list]", start: "top 80%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Section id={sectionIds.experience}>
      <Section.Container ref={ref}>
        <Section.Header title={experience.title} />

        <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
          <div data-experience-nav className="contents">
            <ExperienceNav jobs={experience.items} activeIndex={activeIndex} label={experience.progress} />
          </div>

          <ol data-experience-list className="space-y-10">
            {experience.items.map((job, index) => (
              <li
                key={job.company}
                data-experience-item={index}
                className={cn(
                  "transition-[opacity,scale] duration-500",
                  index === activeIndex ? "lg:opacity-100" : "lg:scale-[0.98] lg:opacity-40",
                )}
              >
                <JobCard job={job} highlightsLabel={experience.highlights} stackLabel={experience.stack} />
              </li>
            ))}
          </ol>
        </div>
      </Section.Container>
    </Section>
  );
}
