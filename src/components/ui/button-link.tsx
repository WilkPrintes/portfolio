import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RollText } from "./roll-text";

type ButtonLinkProps = Omit<ComponentProps<"a">, "children"> & {
  children: string;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  external?: boolean;
};

const variants = {
  primary: {
    root: "bg-accent text-ink",
    fill: "origin-left scale-x-0 bg-accent-soft group-hover:scale-x-100",
  },
  secondary: {
    root: "border border-line bg-ink/50 text-foreground backdrop-blur hover:border-accent hover:text-ink",
    fill: "origin-bottom scale-y-0 bg-accent group-hover:scale-y-100",
  },
};

export function ButtonLink({
  children,
  variant = "primary",
  icon = "→",
  external,
  className,
  ...props
}: ButtonLinkProps) {
  const styles = variants[variant];

  return (
    <a
      {...(external && { target: "_blank", rel: "noreferrer" })}
      {...props}
      className={cn(
        "group relative inline-flex items-center gap-3 overflow-hidden rounded-md px-6 py-3 font-medium transition-[color,border-color,scale] duration-300 active:scale-95",
        styles.root,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-0 transition-transform duration-500 ease-out-expo", styles.fill)}
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent opacity-0 transition-[translate,opacity] duration-700 group-hover:translate-x-[420%] group-hover:opacity-100"
      />
      <RollText className="relative">{children}</RollText>
      <span aria-hidden="true" className="relative inline-flex overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:translate-x-full">
          {icon}
        </span>
        <span className="absolute right-full block transition-transform duration-500 ease-out-expo group-hover:translate-x-full">
          {icon}
        </span>
      </span>
    </a>
  );
}
