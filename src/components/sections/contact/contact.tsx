"use client";

import { useRef } from "react";
import { Section } from "@/components/ui/section";
import { SplitChars } from "@/components/ui/split-text";
import { contactIcons } from "@/config/logos";
import { sectionIds, siteConfig, whatsappUrl } from "@/config/site";
import { useLanguage } from "@/i18n";
import { DESKTOP, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { CodeSnippet } from "./code-snippet";
import { ContactChannels, type ContactChannel } from "./contact-channels";
import { LocalTime } from "./local-time";

const { links } = siteConfig;

export function Contact() {
  const { t } = useLanguage();
  const { contact } = t;
  const ref = useRef<HTMLElement>(null);

  const channels: ContactChannel[] = [
    {
      key: "whatsapp",
      label: contact.channels.whatsapp,
      value: links.phone,
      href: whatsappUrl(contact.whatsappMessage),
      icon: contactIcons.whatsapp,
      accent: "group-hover:text-[#25d366]",
      external: true,
      primary: true,
    },
    {
      key: "email",
      label: contact.channels.email,
      value: links.email,
      href: `mailto:${links.email}`,
      icon: contactIcons.email,
      accent: "group-hover:text-accent",
      copyable: true,
    },
    {
      key: "linkedin",
      label: contact.channels.linkedin,
      value: "in/wilk-printes",
      href: links.linkedin,
      icon: contactIcons.linkedin,
      accent: "group-hover:text-[#0a66c2]",
      external: true,
    },
    {
      key: "github",
      label: contact.channels.github,
      value: "@WilkPrintes",
      href: links.github,
      icon: contactIcons.github,
      accent: "group-hover:text-foreground",
      external: true,
    },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%" } })
          .from("[data-contact-card]", { y: 60, autoAlpha: 0, duration: 0.9, ease: "expo.out" })
          .from("[data-contact-accent]", { scaleX: 0, duration: 1, ease: "expo.inOut" }, "-=0.5")
          .from(
            "[data-char]",
            {
              yPercent: 120,
              scaleY: 2.3,
              scaleX: 0.7,
              autoAlpha: 0,
              transformOrigin: "50% 0%",
              stagger: 0.03,
              duration: 1,
              ease: "back.out(1.7)",
            },
            "-=0.8",
          )
          .from("[data-contact-text]", { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.6")
          .from(
            "[data-contact-channel]",
            { x: -30, autoAlpha: 0, stagger: 0.09, duration: 0.7, ease: "expo.out" },
            "-=0.4",
          )
          .from("[data-contact-meta]", { autoAlpha: 0, duration: 0.6 }, "-=0.3")
          .from(
            "[data-code-window]",
            { y: 40, rotateX: 18, transformPerspective: 900, autoAlpha: 0, duration: 1, ease: "expo.out" },
            0.4,
          )
          .from(
            "[data-code-line]",
            { clipPath: "inset(0% 100% 0% 0%)", stagger: 0.18, duration: 0.45, ease: "steps(14)" },
            0.9,
          );
      });

      mm.add(DESKTOP, () => {
        gsap.fromTo(
          "[data-code-parallax]",
          { y: 30 },
          {
            y: -30,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Section ref={ref} id={sectionIds.contact} className="overflow-hidden px-4 pt-28 pb-12 sm:px-6 lg:pt-36 lg:pb-16">
      <div
        data-contact-card
        className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-12 overflow-hidden rounded-2xl border border-line bg-panel p-6 shadow-2xl shadow-black/60 sm:p-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:p-14"
      >
        <span
          aria-hidden="true"
          data-contact-accent
          className="absolute inset-x-6 top-0 h-px origin-left bg-accent sm:inset-x-10 lg:inset-x-14"
        />

        <div>
          <h2 className="overflow-hidden pb-2 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            <SplitChars text={contact.title} />
          </h2>
          <p data-contact-text className="mt-5 max-w-xl text-lg leading-relaxed text-secondary">
            {contact.text}
          </p>

          <div className="mt-9">
            <ContactChannels
              channels={channels}
              labels={{ primary: contact.primary, copy: contact.copy, copied: contact.copied }}
            />
          </div>

          <div data-contact-meta className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <LocalTime location={contact.location} label={contact.localTime} />
            {links.resume && (
              <a
                href={links.resume}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-secondary underline-offset-4 hover:text-accent hover:underline"
              >
                {contact.resume} ↓
              </a>
            )}
          </div>
        </div>

        <div data-code-parallax>
          <CodeSnippet role={t.hero.role} email={links.email} comment={contact.codeComment} />
        </div>
      </div>
    </Section>
  );
}
