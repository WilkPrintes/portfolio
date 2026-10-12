import { siteConfig } from "@/config/site";

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-ink">
      {/* Extra bottom space below xl keeps the text clear of the fixed contact dock. */}
      <p className="mx-auto max-w-6xl px-4 pt-6 pb-24 text-center font-mono text-xs text-muted sm:px-6 xl:pb-6">
        © {YEAR} {siteConfig.name}
      </p>
    </footer>
  );
}
