import { cn } from "@/lib/utils";

/**
 * Radial glow that follows the pointer. Place it inside a `group` element that receives
 * the `--mx` / `--my` variables from `usePointerVars`.
 */
export function Spotlight({ size = 300, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 0%), rgb(255 176 0 / 0.1), transparent 65%)`,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        className,
      )}
    />
  );
}
