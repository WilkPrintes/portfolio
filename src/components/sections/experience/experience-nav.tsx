"use client";

import { BrandLogo } from "@/components/ui/brand-logo";
import { companyLogos } from "@/config/logos";
import type { Job } from "@/i18n";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ExperienceNavProps = {
  jobs: Job[];
  activeIndex: number;
  label: string;
};

/** Sticky company list: shows where the reader is in the experience and jumps to a job on click. */
export function ExperienceNav({ jobs, activeIndex, label }: ExperienceNavProps) {
  const goTo = (index: number) => {
    const target = document.querySelector(`[data-experience-item="${index}"]`);
    if (!target) return;
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 120 },
      duration: prefersReducedMotion() ? 0 : 1,
      ease: "power3.inOut",
    });
  };

  return (
    <nav aria-label={label} className="sticky top-28 hidden self-start lg:block">
      <p className="mb-4 font-mono text-xs tracking-wider text-muted uppercase">{label}</p>
      <div className="relative pl-5">
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-line">
          <span data-experience-progress className="block h-full w-full origin-top scale-y-0 bg-accent" />
        </span>

        <ol className="space-y-2">
          {jobs.map((job, index) => {
            const isActive = index === activeIndex;
            const logo = companyLogos[job.company];

            return (
              <li key={job.company}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all duration-500",
                    isActive
                      ? "border-accent/40 bg-panel/90 opacity-100"
                      : "border-transparent opacity-55 hover:opacity-90",
                  )}
                >
                  {logo && (
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-md border border-line bg-ink p-1.5 transition-[filter,scale] duration-500",
                        isActive ? "scale-105 opacity-100 saturate-100" : "opacity-80 saturate-50",
                      )}
                    >
                      <BrandLogo logo={logo} alt="" size={28} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-foreground">{job.company}</span>
                    <span className="block truncate font-mono text-xs text-muted">{job.period}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
