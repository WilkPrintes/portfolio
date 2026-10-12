import { Card } from "@/components/ui/card";
import { Tag, TagList } from "@/components/ui/tag";
import { pad } from "@/lib/utils";

type StackCardProps = {
  index: number;
  group: string;
  items: string[];
  itemsLabel: string;
  className?: string;
};

export function StackCard({ index, group, items, itemsLabel, className }: StackCardProps) {
  return (
    <Card data-stack-card spotlight className={className}>
      <span
        aria-hidden="true"
        data-stack-scan
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-accent/15 to-transparent"
      />
      <span
        aria-hidden="true"
        data-stack-topline
        className="absolute inset-x-0 top-0 h-px origin-left bg-linear-to-r from-accent via-accent/60 to-transparent"
      />

      <Card.Header className="items-center font-mono text-xs">
        <span className="text-accent">{pad(index + 1)}</span>
        <span className="text-muted">
          <span data-stack-count={items.length} className="text-foreground">
            {pad(items.length)}
          </span>{" "}
          {itemsLabel}
        </span>
      </Card.Header>
      <Card.Title data-stack-group className="mt-4">
        {group}
      </Card.Title>
      <TagList className="relative mt-5">
        {items.map((item) => (
          <Tag key={item} data-stack-chip variant="outline">
            {item}
          </Tag>
        ))}
      </TagList>
    </Card>
  );
}
