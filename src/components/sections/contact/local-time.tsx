"use client";

import { useSyncExternalStore } from "react";

const TIME_ZONE = "America/Sao_Paulo";
const UTC_OFFSET = "UTC−3";

const formatter = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });

function subscribe(onChange: () => void) {
  const interval = setInterval(onChange, 15_000);
  return () => clearInterval(interval);
}

const getTime = () => formatter.format(new Date());
// Rendered on the server and during hydration: the clock only appears on the client.
const getServerTime = () => "";

/** "Brazil · UTC−3 · 16:34 local time", updated live so visitors abroad know when to expect a reply. */
export function LocalTime({ location, label }: { location: string; label: string }) {
  const time = useSyncExternalStore(subscribe, getTime, getServerTime);

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
        {location}
      </span>
      <span aria-hidden="true">·</span>
      <span>{UTC_OFFSET}</span>
      {time && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            <time className="text-secondary">{time}</time> {label}
          </span>
        </>
      )}
    </p>
  );
}
