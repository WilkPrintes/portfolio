"use client";

import { LogoLoop, type LogoLoopItem } from "@/components/ui/logo-loop";
import { techLogos } from "@/config/logos";

const items: LogoLoopItem[] = techLogos.map(({ name, icon: Icon, color }) => ({
  key: name,
  label: name,
  node: (
    <span className="group flex items-center gap-3 rounded-xl border border-line bg-panel/70 px-4 py-3 transition-colors hover:border-accent/50">
      <Icon
        aria-hidden="true"
        size={26}
        color={color}
        className="transition-transform duration-300 group-hover:scale-110"
      />
      <span className="font-mono text-sm text-secondary">{name}</span>
    </span>
  ),
}));

/** Infinite strip of technology logos (pauses on hover). */
export function StackMarquee({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div className="mb-10 space-y-4">
      <LogoLoop items={items} speed={50} hoverSpeed={0} gap={16} ariaLabel={ariaLabel} />
      <LogoLoop items={[...items].reverse()} speed={-35} hoverSpeed={0} gap={16} ariaLabel={ariaLabel} />
    </div>
  );
}
