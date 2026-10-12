import { techIcons } from "@/config/logos";
import { cn } from "@/lib/utils";

type TechStackProps = {
  items: string[];
  label: string;
  className?: string;
};

/** Row of monochrome technology icons; each one lights up on hover and shows its name. */
export function TechStack({ items, label, className }: TechStackProps) {
  return (
    <ul aria-label={label} className={cn("relative flex flex-wrap items-center gap-4", className)}>
      {items.map((name) => {
        const Icon = techIcons[name];
        return (
          <li key={name} data-tech-icon title={name} className="group/tech relative">
            {Icon ? (
              <Icon
                aria-hidden="true"
                className="size-5 text-foreground opacity-45 transition-opacity duration-200 group-hover/tech:opacity-100"
              />
            ) : (
              <span className="font-mono text-xs text-muted">{name}</span>
            )}
            <span className="sr-only">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
