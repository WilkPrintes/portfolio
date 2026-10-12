/* eslint-disable @next/next/no-img-element -- small, already optimized static logos */
import type { Logo } from "@/config/logos";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  logo: Logo;
  alt: string;
  /** Rendered height in pixels; width follows the aspect ratio. */
  size?: number;
  className?: string;
};

/** Renders either an image logo or an icon logo at a fixed height. */
export function BrandLogo({ logo, alt, size = 32, className }: BrandLogoProps) {
  if (logo.kind === "icon") {
    const Icon = logo.icon;
    return <Icon role="img" aria-label={alt} size={size} color={logo.color} className={cn("shrink-0", className)} />;
  }

  return (
    <img
      src={logo.src}
      alt={alt}
      width={Math.round((logo.width / logo.height) * size)}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn("shrink-0 object-contain", className)}
      style={{ height: size, width: "auto" }}
    />
  );
}
