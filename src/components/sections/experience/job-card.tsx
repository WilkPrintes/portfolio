import { BrandLogo } from "@/components/ui/brand-logo";
import { Card } from "@/components/ui/card";
import { Glare } from "@/components/ui/glare";
import { Tag, TagList } from "@/components/ui/tag";
import { companyLogos } from "@/config/logos";
import type { Job } from "@/i18n";
import { cn } from "@/lib/utils";

type JobCardProps = {
  job: Job;
  highlightsLabel: string;
  stackLabel: string;
};

function JobHeader({ job }: { job: Job }) {
  const logo = companyLogos[job.company];
  const company = job.url ? (
    <a href={job.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
      {job.company} ↗
    </a>
  ) : (
    job.company
  );

  return (
    <div className="relative flex items-center gap-4">
      {logo && (
        <span
          data-job-logo
          className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-line bg-ink p-2"
        >
          <BrandLogo logo={logo} alt={job.company} size={36} />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-lg font-semibold text-foreground">{company}</p>
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">{job.period}</span>
          {job.product && <> · {job.product}</>}
        </p>
      </div>
    </div>
  );
}

export function JobCard({ job, highlightsLabel, stackLabel }: JobCardProps) {
  return (
    <Glare>
      <Card data-job-card featured={job.featured} spotlight className={cn("sm:p-8", !job.featured && "bg-panel/50")}>
        <JobHeader job={job} />

        <Card.Title className={cn("mt-6", job.featured ? "sm:text-3xl" : "text-xl")}>{job.role}</Card.Title>
        {job.team && (
          <p className="relative mt-2 inline-flex items-center gap-2 rounded border border-line px-2 py-0.5 font-mono text-xs text-accent-soft">
            <span aria-hidden="true">◆</span>
            {job.team}
          </p>
        )}
        <p className="relative mt-4 leading-relaxed text-foreground/85">{job.summary}</p>

        <Card.Section label={highlightsLabel} className="mt-6">
          <ul className="space-y-2.5">
            {job.highlights.map((highlight) => (
              <li key={highlight} data-job-highlight className="flex gap-3 leading-relaxed text-foreground/70">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                {highlight}
              </li>
            ))}
          </ul>
        </Card.Section>

        <TagList aria-label={stackLabel} className="relative mt-6">
          {job.stack.map((tech) => (
            <Tag key={tech} data-job-tag>
              {tech}
            </Tag>
          ))}
        </TagList>
      </Card>
    </Glare>
  );
}
