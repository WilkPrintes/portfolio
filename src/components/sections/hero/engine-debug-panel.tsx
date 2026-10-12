import type { RefObject } from "react";

type EngineDebugPanelProps = {
  title: string;
  note: string;
  minimapRef: RefObject<HTMLCanvasElement | null>;
  statsRef: RefObject<HTMLSpanElement | null>;
};

/** Live top-down view of the raycasting engine running in the background. */
export function EngineDebugPanel({ title, note, minimapRef, statsRef }: EngineDebugPanelProps) {
  return (
    <aside data-hero-debug className="ticks hidden w-64 border border-line bg-ink/75 p-4 backdrop-blur lg:block">
      <p className="font-mono text-xs text-muted">{title}</p>
      <canvas
        ref={minimapRef}
        width={224}
        height={224}
        aria-hidden="true"
        className="mt-3 size-56 [image-rendering:pixelated]"
      />
      <p className="mt-3 font-mono text-xs text-accent">
        <span className="mr-2 inline-block size-1.5 rounded-full bg-ok align-middle" />
        <span ref={statsRef}>— fps</span>
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{note}</p>
    </aside>
  );
}
