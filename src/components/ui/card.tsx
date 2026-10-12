"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";
import { usePointerVars } from "@/hooks/use-pointer-vars";
import { cn } from "@/lib/utils";
import { Spotlight } from "./spotlight";

type CardProps = Omit<ComponentProps<"div">, "ref"> & {
  /** Highlighted card: amber border and technical-drawing corner ticks. */
  featured?: boolean;
  /** Adds a glow that follows the pointer. */
  spotlight?: boolean;
};

function CardRoot({ featured, spotlight, className, children, ...props }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePointerVars(ref, spotlight);

  return (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden border p-6 transition-colors",
        featured ? "ticks border-accent/40 bg-card" : "border-line bg-card",
        spotlight && "hover:border-accent/50",
        className,
      )}
      {...props}
    >
      {spotlight && <Spotlight />}
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("relative flex flex-wrap items-baseline justify-between gap-2", className)} {...props} />;
}

function CardEyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("relative font-mono text-xs text-accent", className)} {...props} />;
}

function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn("relative text-xl font-semibold tracking-tight text-foreground sm:text-2xl", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("relative mt-3 leading-relaxed text-secondary", className)} {...props} />;
}

/** Labelled block inside a card, e.g. "Highlights" followed by a list. */
function CardSection({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("relative mt-7", className)}>
      <h4 className="font-mono text-xs tracking-wider text-muted uppercase">{label}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("relative mt-5 flex gap-4 border-t border-line pt-4 text-sm", className)} {...props} />;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Eyebrow: CardEyebrow,
  Title: CardTitle,
  Description: CardDescription,
  Section: CardSection,
  Footer: CardFooter,
});
