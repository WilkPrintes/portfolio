import { Card } from "@/components/ui/card";
import { Tag, TagList } from "@/components/ui/tag";
import type { Job } from "@/i18n";
import { cn } from "@/lib/utils";

type JobCardProps = {
  job: Job;
  highlightsLabel: string;
  stackLabel: string;
};

function JobMeta({ job }: { job: Job }) {
  return (
    <div data-job-meta>
      <p className="font-mono text-sm text-accent">{job.period}</p>
      <p className="mt-1 text-xl font-semibold text-foreground">
        {job.url ? (
          <a href={job.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
            {job.company} ↗
          </a>
        ) : (
          job.company
        )}
      </p>
      {job.product && <p className="mt-1 font-mono text-xs text-muted">{job.product}</p>}
    </div>
  );
}

export function JobCard({ job, highlightsLabel, stackLabel }: JobCardProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr] lg:gap-10">
      <JobMeta job={job} />

      <Card
        data-job-card
        featured={job.featured}
        spotlight={job.featured}
        className={cn("sm:p-8", !job.featured && "bg-panel/50")}
      >
        <Card.Title className={cn(job.featured ? "sm:text-3xl" : "text-xl")}>{job.role}</Card.Title>
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
    </div>
  );
}
