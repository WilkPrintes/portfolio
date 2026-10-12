"use client";

import { useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Returns the id of the section currently crossing the middle of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useGSAP(
    () => {
      ids.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          // Refresh last, after pinned sections have added their scroll distance.
          refreshPriority: -1,
          onToggle: ({ isActive }) => {
            setActive((current) => (isActive ? id : current === id ? null : current));
          },
        });
      });
    },
    { dependencies: [ids.join()] },
  );

  return active;
}
