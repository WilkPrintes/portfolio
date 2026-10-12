import type { Education } from "@/i18n";
import { cn } from "@/lib/utils";

type StudyTimelineProps = {
  items: Education[];
  from: number;
  to: number;
};

/** Horizontal year axis with one bar per program. Hidden on small screens. */
export function StudyTimeline({ items, from, to }: StudyTimelineProps) {
  const years = Array.from({ length: to - from + 1 }, (_, index) => from + index);
  const toPercent = (year: number) => ((year - from) / (to - from)) * 100;

  return (
    <div data-study-timeline className="relative mb-14 hidden h-24 sm:block">
      <div data-axis className="absolute inset-x-0 top-14 h-px origin-left bg-line" />

      {years.map((year) => (
        <span
          key={year}
          data-year
          className="absolute top-16 -translate-x-1/2 font-mono text-xs text-muted"
          style={{ left: `${toPercent(year)}%` }}
        >
          <span className="mx-auto mb-1 block h-2 w-px bg-line" />
          {year}
        </span>
      ))}

      {/* Oldest program on the top row. */}
      {[...items].reverse().map((item, row) => (
        <div
          key={item.place}
          className="absolute"
          style={{
            left: `${toPercent(item.start)}%`,
            width: `${toPercent(item.end) - toPercent(item.start)}%`,
            top: row * 24,
          }}
        >
          <p data-bar-label className="mb-1 font-mono text-xs text-foreground">
            {item.place}
          </p>
          <div data-bar className={cn("h-1.5 origin-left rounded-full", item.featured ? "bg-accent" : "bg-muted/60")} />
        </div>
      ))}
    </div>
  );
}
