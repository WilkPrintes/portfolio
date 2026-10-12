import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-8 text-center font-mono text-xs text-muted">{siteConfig.name}</footer>
  );
}
