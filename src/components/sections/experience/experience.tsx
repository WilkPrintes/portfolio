"use client";

import { useRef } from "react";
import { Backdrop } from "@/components/ui/backdrop";
import { Section } from "@/components/ui/section";
import { Timeline } from "@/components/ui/timeline";
import { sectionIds } from "@/config/site";
import { useLanguage } from "@/i18n";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { JobCard } from "./job-card";

export function Experience() {
  const { t } = useLanguage();
  const { experience } = t;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-experience-item]").forEach((item) => {
          gsap
            .timeline({ scrollTrigger: { trigger: item, start: "top 80%" } })
            .from(item.querySelector("[data-timeline-dot]"), { scale: 0, duration: 0.5, ease: "back.out(3)" })
            .from(
              item.querySelector("[data-job-meta]"),
              { x: -24, autoAlpha: 0, duration: 0.7, ease: "power3.out" },
              "-=0.3",
            )
            .from(item.querySelector("[data-job-card]"), { y: 40, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, "<")
            .from(
              item.querySelectorAll("[data-job-highlight]"),
              { x: 16, autoAlpha: 0, stagger: 0.07, duration: 0.5, ease: "power2.out" },
              "-=0.5",
            )
            .from(
              item.querySelectorAll("[data-job-tag]"),
              { y: 8, autoAlpha: 0, stagger: 0.04, duration: 0.35 },
              "-=0.3",
            );
        });
      });
    },
    { scope: ref },
  );

  return (
    <Section id={sectionIds.experience}>
      <Backdrop>
        <Backdrop.Dots />
        <Backdrop.Glows side="left" />
        <Backdrop.Watermark side="left">02</Backdrop.Watermark>
      </Backdrop>

      <Section.Container ref={ref}>
        <Section.Header index={experience.index} title={experience.title} subtitle={experience.subtitle} />
        <Timeline>
          {experience.items.map((job) => (
            <Timeline.Item key={job.company} data-experience-item highlighted={job.featured}>
              <JobCard job={job} highlightsLabel={experience.highlights} stackLabel={experience.stack} />
            </Timeline.Item>
          ))}
        </Timeline>
      </Section.Container>
    </Section>
  );
}
