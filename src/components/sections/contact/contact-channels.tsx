"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export type ContactChannel = {
  key: string;
  label: string;
  /** What the visitor sees and can copy, e.g. the email address or phone number. */
  value: string;
  href: string;
  icon: IconType;
  /** Hover color of the icon, as a Tailwind class. */
  accent: string;
  external?: boolean;
  primary?: boolean;
  copyable?: boolean;
};

type ContactChannelsProps = {
  channels: ContactChannel[];
  labels: { primary: string; copy: string; copied: string };
};

function CopyButton({ value, labels }: { value: string; labels: ContactChannelsProps["labels"] }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (permissions, insecure context); the link still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? labels.copied : `${labels.copy} ${value}`}
      className={cn(
        "relative flex shrink-0 items-center gap-2 rounded-lg border px-3 font-mono text-xs transition-colors",
        copied ? "border-ok/50 text-ok" : "border-line text-muted hover:border-accent hover:text-accent",
      )}
    >
      {copied ? <FaCheck aria-hidden="true" className="size-3" /> : <FaRegCopy aria-hidden="true" className="size-3" />}
      <span className="hidden sm:inline" aria-live="polite">
        {copied ? labels.copied : labels.copy}
      </span>
    </button>
  );
}

/** Every way to get in touch, each as a full-width row: icon, channel, handle and an arrow. */
export function ContactChannels({ channels, labels }: ContactChannelsProps) {
  return (
    <ul className="space-y-3">
      {channels.map((channel) => {
        const Icon = channel.icon;
        return (
          <li key={channel.key} data-contact-channel className="flex gap-2">
            <a
              href={channel.href}
              {...(channel.external && { target: "_blank", rel: "noreferrer" })}
              className={cn(
                "group flex min-w-0 flex-1 items-center gap-4 rounded-xl border p-3 pr-4 transition-colors duration-300",
                channel.primary
                  ? "border-accent/50 bg-accent/8 hover:border-accent hover:bg-accent/12"
                  : "border-line bg-ink/60 hover:border-accent/50 hover:bg-ink",
              )}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
                  channel.primary ? "border-accent/40 bg-accent text-ink" : "border-line bg-panel text-secondary",
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn("size-5 transition-colors duration-300", !channel.primary && channel.accent)}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{channel.label}</span>
                  {channel.primary && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-accent-soft uppercase">
                      {labels.primary}
                    </span>
                  )}
                </span>
                <span className="block truncate font-mono text-sm text-muted transition-colors group-hover:text-secondary">
                  {channel.value}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-muted transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-accent"
              >
                {channel.external ? "↗" : "→"}
              </span>
            </a>
            {channel.copyable && <CopyButton value={channel.value} labels={labels} />}
          </li>
        );
      })}
    </ul>
  );
}
