import { cn } from "@/lib/utils";

const rollClass = "block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full";

/**
 * Text that rolls up on hover: a copy below slides in to replace it.
 * The hover target must have the `group` class.
 */
export function RollText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <span className={rollClass}>{children}</span>
      <span aria-hidden="true" className={cn(rollClass, "absolute top-full left-0")}>
        {children}
      </span>
    </span>
  );
}
