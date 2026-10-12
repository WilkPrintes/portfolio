import type { ReactNode } from "react";
import GlareHover from "@/components/react-bits/glare-hover";

/** Project-wide preset for React Bits' GlareHover: a soft amber glint across the card on hover. */
export function Glare({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <GlareHover
      width="100%"
      height="100%"
      background="transparent"
      borderRadius="0px"
      borderColor="transparent"
      glareColor="#ffb000"
      glareOpacity={0.16}
      glareSize={260}
      className={className}
      style={{ placeItems: "stretch", borderWidth: 0 }}
    >
      {children}
    </GlareHover>
  );
}
