"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Magnetic } from "@/components/ui/magnetic";
import { Section } from "@/components/ui/section";
import { SplitChars } from "@/components/ui/split-text";
import { contactIcons } from "@/config/logos";
import { sectionIds, siteConfig, whatsappUrl } from "@/config/site";
import { useLanguage } from "@/i18n";
import { DESKTOP, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { CodeSnippet } from "./code-snippet";

const { links } = siteConfig;
const { whatsapp: WhatsappIcon, linkedin: LinkedinIcon, github: GithubIcon } = contactIcons;

export function Contact() {
  const { t } = useLanguage();
  const { contact } = t;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%" } })
          .from("[data-contact-card]", { y: 60, autoAlpha: 0, duration: 0.9, ease: "expo.out" })
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
            "-=0.2",
          )
          .from("[data-contact-text]", { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.6")
          .from("[data-contact-email]", { clipPath: "inset(0% 100% 0% 0%)", duration: 1, ease: "expo.inOut" }, "-=0.5")
          .from(
            "[data-contact-actions] > *",
            { y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" },
            "-=0.5",
          )
          .from(
            "[data-code-window]",
            { y: 40, rotateX: 18, transformPerspective: 900, autoAlpha: 0, duration: 1, ease: "expo.out" },
            0.3,
          )
          .from(
            "[data-code-line]",
            { clipPath: "inset(0% 100% 0% 0%)", stagger: 0.18, duration: 0.45, ease: "steps(14)" },
            0.8,
          );
      });

      mm.add(DESKTOP, () => {
        gsap.fromTo(
          "[data-code-parallax]",
          { y: 40 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Section
      ref={ref}
      id={sectionIds.contact}
      className="overflow-hidden border-t border-line px-4 py-32 sm:px-6 lg:py-40"
    >
      <div
        data-contact-card
        className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 rounded-2xl border border-line bg-panel p-6 shadow-2xl shadow-black/60 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:p-14"
      >
        <div className="text-center lg:text-left">
          <h2 className="overflow-hidden pb-2 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            <SplitChars text={contact.title} />
          </h2>
          <p data-contact-text className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-secondary lg:mx-0">
            {contact.text}
          </p>
          <a
            data-contact-email
            href={`mailto:${links.email}`}
            className="mt-8 inline-block font-mono text-xl break-all text-accent underline decoration-accent/40 underline-offset-8 transition-colors hover:decoration-accent sm:text-2xl"
          >
            {links.email}
          </a>
          <div data-contact-actions className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Magnetic>
              <ButtonLink
                href={whatsappUrl(contact.whatsappMessage)}
                external
                icon="↗"
                leadingIcon={<WhatsappIcon className="size-4" />}
              >
                WhatsApp
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink
                href={links.linkedin}
                external
                variant="secondary"
                icon="↗"
                leadingIcon={<LinkedinIcon className="size-4" />}
              >
                LinkedIn
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink
                href={links.github}
                external
                variant="secondary"
                icon="↗"
                leadingIcon={<GithubIcon className="size-4" />}
              >
                GitHub
              </ButtonLink>
            </Magnetic>
            {links.resume && (
              <Magnetic>
                <ButtonLink href={links.resume} external variant="secondary" icon="↓">
                  {contact.resume}
                </ButtonLink>
              </Magnetic>
            )}
          </div>
          <p data-contact-text className="mt-8 font-mono text-xs text-muted">
            ◆ {contact.location}
          </p>
        </div>

        <div data-code-parallax>
          <CodeSnippet role={t.hero.role} email={links.email} comment={contact.codeComment} />
        </div>
      </div>
    </Section>
  );
}
