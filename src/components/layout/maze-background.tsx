"use client";

import { useEffect, useRef } from "react";
import { blueprintLayout, renderBlueprint } from "@/lib/raycaster";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/**
 * The hero's maze, drawn as a faint floor plan behind the whole page.
 * Scrolling moves the camera along its path, so reading the page is walking through the maze.
 */
export function MazeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const state = { progress: 0 };
    const view = { width: 0, height: 0 };
    let layout = blueprintLayout(1, 1);

    const draw = () => renderBlueprint(ctx, layout, state.progress, view.width, view.height);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      view.width = window.innerWidth;
      view.height = window.innerHeight;
      canvas.width = Math.round(view.width * ratio);
      canvas.height = Math.round(view.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      layout = blueprintLayout(view.width, view.height);
      draw();
    };

    const reduced = prefersReducedMotion();
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: ({ progress }) => {
        if (reduced) {
          state.progress = progress;
          draw();
          return;
        }
        gsap.to(state, { progress, duration: 0.8, ease: "power3.out", overwrite: true, onUpdate: draw });
      },
    });

    resize();
    window.addEventListener("resize", resize);
    return () => {
      trigger.kill();
      gsap.killTweensOf(state);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 size-full" />;
}
