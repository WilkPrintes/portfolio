"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";
import { RollText } from "@/components/ui/roll-text";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Fixed top bar with a scroll progress line. Items marked with `data-nav-item` animate in. */
function NavbarRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to("[data-scroll-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ delay: 1 })
          .from("[data-navbar-bar]", { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.out" })
          .from(
            "[data-nav-item]",
            { y: -12, autoAlpha: 0, stagger: 0.06, duration: 0.5, ease: "power3.out", clearProps: "transform" },
            "-=0.4",
          );
      });
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50">
      <div data-navbar-bar className="border-b border-line bg-ink/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">{children}</nav>
      </div>
      <div data-scroll-progress className="h-px origin-left scale-x-0 bg-accent" />
    </header>
  );
}

function NavbarActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-3 sm:gap-6", className)} {...props} />;
}

function NavbarLinks({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("hidden gap-6 font-mono text-sm lg:flex", className)} {...props} />;
}

type NavbarLinkProps = { href: string; active?: boolean; children: string };

function NavbarLink({ href, active, children }: NavbarLinkProps) {
  return (
    <li data-nav-item>
      <a
        href={href}
        aria-current={active ? "true" : undefined}
        className={cn(
          "group relative block py-1 transition-colors duration-300 hover:text-foreground",
          active ? "text-foreground" : "text-muted",
        )}
      >
        <RollText>{children}</RollText>
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-x-100",
            active ? "scale-x-100" : "scale-x-0",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 -left-3 size-1 -translate-y-1/2 rounded-full bg-accent transition-[opacity,scale] duration-300",
            active ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        />
      </a>
    </li>
  );
}

export const Navbar = Object.assign(NavbarRoot, {
  Actions: NavbarActions,
  Links: NavbarLinks,
  Link: NavbarLink,
});
