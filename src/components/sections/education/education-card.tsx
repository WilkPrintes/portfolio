import { Card } from "@/components/ui/card";
import { Tag, TagList } from "@/components/ui/tag";
import type { Education } from "@/i18n";
import { cn } from "@/lib/utils";

type EducationCardProps = {
  item: Education;
  topicsLabel: string;
  projectsLabel: string;
};

export function EducationCard({ item, topicsLabel, projectsLabel }: EducationCardProps) {
  return (
    <Card data-education-card featured={item.featured} className={cn("sm:p-8", !item.featured && "self-start")}>
      {item.featured && (
        <span aria-hidden="true" className="absolute -top-10 -right-10 size-40 rounded-full bg-accent/10 blur-3xl" />
      )}

      <Card.Header>
        <Card.Eyebrow data-education-place className="text-sm">
          {item.place}
        </Card.Eyebrow>
        <p className="font-mono text-xs text-muted">{item.period}</p>
      </Card.Header>
      <Card.Title className={cn("mt-3", item.featured && "text-3xl")}>{item.title}</Card.Title>
      <Card.Description className="mt-4 text-foreground/80">{item.description}</Card.Description>

      {item.topics.length > 0 && (
        <Card.Section label={topicsLabel}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {item.topics.map((topic) => (
              <li key={topic} data-education-topic className="flex items-center gap-3 text-foreground/80">
                <span aria-hidden="true" className="h-px w-3 bg-accent" />
                {topic}
              </li>
            ))}
          </ul>
        </Card.Section>
      )}

      {item.projects && (
        <Card.Section label={projectsLabel}>
          <TagList>
            {item.projects.map((project) => (
              <Tag key={project} data-education-project>
                {project}
              </Tag>
            ))}
          </TagList>
        </Card.Section>
      )}
    </Card>
  );
}
