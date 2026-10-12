"use client";

import { useRef } from "react";
import type { IconType } from "react-icons";
import { contactIcons } from "@/config/logos";
import { siteConfig, whatsappUrl } from "@/config/site";
import { useLanguage } from "@/i18n";
import { FINE_POINTER, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const MAGNIFY_RADIUS = 110;
/** From this breakpoint the dock sits vertically on the left edge, outside the content column. */
const VERTICAL = "(min-width: 1280px)";
const MAX_SCALE = 1.45;

type DockItem = {
  key: string;
  href: string;
  label: string;
  icon: IconType;
  hoverColor: string;
  external?: boolean;
};

/** Always-visible contact shortcuts with macOS-style magnification. */
export function ContactDock() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { links } = siteConfig;

  const items: DockItem[] = [
    {
      key: "whatsapp",
      href: whatsappUrl(t.contact.whatsappMessage),
      label: t.dock.whatsapp,
      icon: contactIcons.whatsapp,
      hoverColor: "group-hover:text-[#25d366]",
      external: true,
    },
    {
      key: "email",
      href: `mailto:${links.email}`,
      label: t.dock.email,
      icon: contactIcons.email,
      hoverColor: "group-hover:text-accent",
    },
    {
      key: "linkedin",
      href: links.linkedin,
      label: "LinkedIn",
      icon: contactIcons.linkedin,
      hoverColor: "group-hover:text-[#0a66c2]",
      external: true,
    },
    {
      key: "github",
      href: links.github,
      label: "GitHub",
      icon: contactIcons.github,
      hoverColor: "group-hover:text-foreground",
      external: true,
    },
  ];

  useGSAP(
    (_, contextSafe) => {
      const dock = ref.current;
      if (!dock || !contextSafe) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, vertical: VERTICAL }, (context) => {
        if (!context.conditions?.motion) return;
        const offset = context.conditions.vertical ? { xPercent: -160 } : { yPercent: 160 };
        gsap.from(dock, { ...offset, autoAlpha: 0, duration: 0.9, delay: 2, ease: "expo.out" });
      });

      mm.add({ pointer: FINE_POINTER, vertical: VERTICAL }, (context) => {
        if (!context.conditions?.pointer) return;
        const vertical = Boolean(context.conditions.vertical);
        const buttons = gsap.utils.toArray<HTMLElement>("[data-dock-item]");
        const setters = buttons.map((button) => ({
          button,
          scale: gsap.quickTo(button, "scale", { duration: 0.3, ease: "power3.out" }),
          lift: gsap.quickTo(button, vertical ? "x" : "y", { duration: 0.3, ease: "power3.out" }),
        }));

        const onPointerMove = contextSafe((event: PointerEvent) => {
          setters.forEach(({ button, scale, lift }) => {
            const rect = button.getBoundingClientRect();
            const distance = vertical
              ? Math.abs(event.clientY - (rect.top + rect.height / 2))
              : Math.abs(event.clientX - (rect.left + rect.width / 2));
            const strength = Math.max(0, 1 - distance / MAGNIFY_RADIUS);
            scale(1 + strength * (MAX_SCALE - 1));
            lift(vertical ? strength * 10 : -strength * 10);
          });
        });
        const onPointerLeave = contextSafe(() => {
          setters.forEach(({ scale, lift }) => {
            scale(1);
            lift(0);
          });
        });

        dock.addEventListener("pointermove", onPointerMove);
        dock.addEventListener("pointerleave", onPointerLeave);
        return () => {
          dock.removeEventListener("pointermove", onPointerMove);
          dock.removeEventListener("pointerleave", onPointerLeave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <nav
      ref={ref}
      aria-label={t.dock.label}
      className="fixed bottom-5 left-1/2 z-60 -translate-x-1/2 rounded-2xl border border-line bg-ink/80 p-2 shadow-2xl shadow-black/60 backdrop-blur-md sm:bottom-8 xl:top-1/2 xl:bottom-auto xl:left-4 xl:translate-x-0 xl:-translate-y-1/2"
    >
      <ul className="flex items-end gap-1.5 xl:flex-col xl:items-start">
        {items.map(({ key, href, label, icon: Icon, hoverColor, external }) => (
          <li key={key}>
            <a
              href={href}
              aria-label={label}
              data-dock-item
              {...(external && { target: "_blank", rel: "noreferrer" })}
              className="group relative flex size-11 origin-bottom items-center justify-center rounded-xl border border-transparent bg-panel text-muted transition-colors duration-200 hover:border-line xl:origin-left"
            >
              <Icon aria-hidden="true" className={cn("size-5 transition-colors duration-200", hoverColor)} />
              <span
                role="tooltip"
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 rounded-md border border-line bg-panel px-2 py-1 font-mono text-[11px] whitespace-nowrap text-foreground opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 xl:top-1/2 xl:left-full xl:ml-3 xl:translate-x-0 xl:-translate-y-1/2 xl:group-hover:-translate-y-1/2 xl:group-focus-visible:-translate-y-1/2"
              >
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
