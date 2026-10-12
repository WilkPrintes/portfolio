"use client";

import DotGrid from "@/components/react-bits/dot-grid";

/** Fixed, interactive dot grid behind the whole page: dots react to the pointer and ripple on click. */
export function PageBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <DotGrid
        dotSize={2.5}
        gap={22}
        baseColor="#2c2c33"
        activeColor="#ffb000"
        proximity={140}
        shockRadius={280}
        shockStrength={4}
        glow={0.6}
        fade={0.2}
        className="size-full"
      />
    </div>
  );
}
