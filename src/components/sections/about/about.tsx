"use client";

import { Backdrop } from "@/components/ui/backdrop";
import { Section } from "@/components/ui/section";
import { sectionIds } from "@/config/site";
import { useLanguage } from "@/i18n";
import { Bio } from "./bio";
import { Principles } from "./principles";
import { ProfileCard } from "./profile-card";
import { StackGrid } from "./stack-grid";
import { StackMarquee } from "./stack-marquee";

const MARQUEE_ITEMS = 18;

export function About() {
  const { t } = useLanguage();
  const { about } = t;

  return (
    <Section id={sectionIds.about}>
      <Backdrop>
        <Backdrop.Dots />
        <Backdrop.Glows />
        <Backdrop.Watermark>01</Backdrop.Watermark>
      </Backdrop>

      <Section.Container>
        <Section.Header index={about.index} title={about.title} subtitle={about.subtitle} />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[7fr_5fr]">
          <Bio paragraphs={about.bio} />
          <ProfileCard rows={about.profile} />
        </div>

        <Section.Subheading>{about.principlesTitle}</Section.Subheading>
        <Principles items={about.principles} />

        <Section.Subheading>{about.skillsTitle}</Section.Subheading>
      </Section.Container>

      <StackMarquee items={about.skills.flatMap((group) => group.items).slice(0, MARQUEE_ITEMS)} />

      <Section.Container>
        <StackGrid groups={about.skills} itemsLabel={about.itemsLabel} />
      </Section.Container>
    </Section>
  );
}
