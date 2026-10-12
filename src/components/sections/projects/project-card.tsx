"use client";

import { useRef, type ComponentProps } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Card } from "@/components/ui/card";
import { Glare } from "@/components/ui/glare";
import { TechStack } from "@/components/ui/tech-stack";
import { projectLogos } from "@/config/logos";
import { useTilt } from "@/hooks/use-tilt";
import type { Project } from "@/i18n";
import { cn, pad } from "@/lib/utils";

const cardSize = "lg:h-[min(420px,50svh)] lg:min-h-[340px]";

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  labels: { live: string; code: string; private: string; stack: string };
};

export function ProjectCard({ project, index, total, labels }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);
  const logo = projectLogos[project.name];

  return (
    <div ref={ref} data-project-card className={cn("flex", cardSize, "lg:w-[360px]")}>
      <Glare>
        <Card spotlight className="flex w-full flex-col hover:border-accent/60">
          <Card.Header className="items-start">
            <span
              data-project-logo
              className="ticks flex h-14 min-w-14 items-center justify-center border border-line bg-ink px-3 transition-colors group-hover:border-accent/60"
            >
              {logo ? (
                <BrandLogo
                  logo={logo}
                  alt={project.name}
                  size={logo.kind === "image" && logo.width > logo.height ? 24 : 32}
                />
              ) : (
                <span className="font-mono text-base font-medium text-accent">{project.badge}</span>
              )}
            </span>
            <span className="font-mono text-xs text-muted">
              {pad(index + 1)} / {pad(total)}
            </span>
          </Card.Header>
          <Card.Eyebrow className="mt-5 text-accent-soft">{project.kind}</Card.Eyebrow>
          <Card.Title className="mt-1">{project.name}</Card.Title>
          <Card.Description className="flex-1">{project.description}</Card.Description>
          <TechStack items={project.stack} label={labels.stack} className="mt-5" />
          <Card.Footer>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent hover:underline hover:underline-offset-4"
              >
                {labels.live} ↗
              </a>
            )}
            {project.repo ? (
              <a href={project.repo} target="_blank" rel="noreferrer" className="text-foreground hover:text-accent">
                {labels.code} ↗
              </a>
            ) : (
              <span className="text-muted">{labels.private}</span>
            )}
          </Card.Footer>
        </Card>
      </Glare>
    </div>
  );
}

/** Last card in the track, linking to the full GitHub profile. */
export function ProjectsMoreCard({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      data-project-card
      target="_blank"
      rel="noreferrer"
      className={cn(
        "flex items-center justify-center border border-dashed border-line bg-card p-7 text-center font-mono text-sm text-muted transition-colors hover:border-accent hover:text-accent lg:w-[240px]",
        cardSize,
        className,
      )}
      {...props}
    />
  );
}
