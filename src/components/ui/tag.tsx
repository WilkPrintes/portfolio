import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  solid: "rounded bg-accent/10 text-accent-soft",
  outline: "rounded border border-line bg-ink/60 text-muted",
};

type TagProps = ComponentProps<"li"> & { variant?: keyof typeof variants };

export function Tag({ variant = "solid", className, ...props }: TagProps) {
  return <li className={cn("px-2.5 py-1 font-mono text-xs", variants[variant], className)} {...props} />;
}

export function TagList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("flex flex-wrap gap-2", className)} {...props} />;
}
