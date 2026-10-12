"use client";

import { useEffect, useRef, type RefObject } from "react";
import { PATH_LENGTH, pointAt, renderMinimap, renderScene, type Camera } from "@/lib/raycaster";
import { prefersReducedMotion } from "@/lib/gsap";

/** Camera speed in cells per second (one lap takes about a minute). */
const SPEED = 1.3;
/** How far ahead on the path the camera looks, so turns start early. */
const LOOK_AHEAD = 0.9;
/** Internal resolution is intentionally low: cheap to render and close to the cub3D look. */
const MIN_RENDER_WIDTH = 240;
const MAX_RENDER_WIDTH = 480;

type RaycastSceneProps = {
  /** Optional top-down debug canvas. */
  minimapRef?: RefObject<HTMLCanvasElement | null>;
  /** Optional element that receives the measured FPS. */
  statsRef?: RefObject<HTMLElement | null>;
};

export function RaycastScene({ minimapRef, statsRef }: RaycastSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = prefersReducedMotion();
    const [startX, startY] = pointAt(0);
    const camera: Camera = { x: startX, y: startY, angle: 0, bob: 0 };
    let travelled = 0;
    let lookOffset = 0;
    let lookTarget = 0;
    let width = MIN_RENDER_WIDTH;
    let height = 180;
    let isVisible = true;
    let frameId = 0;
    let lastTime = performance.now();
    let frames = 0;
    let statsTime = lastTime;

    const headingAt = (distance: number) => {
      const [x, y] = pointAt(distance + LOOK_AHEAD);
      return Math.atan2(y - camera.y, x - camera.x);
    };
    camera.angle = headingAt(0);

    const draw = () => {
      const view = { ...camera, angle: camera.angle + lookOffset };
      renderScene(ctx, view, width, height);

      const minimap = minimapRef?.current;
      const minimapCtx = minimap?.getContext("2d");
      if (minimap && minimapCtx && minimap.offsetParent !== null) renderMinimap(minimapCtx, view, travelled);
    };

    const update = (dt: number) => {
      travelled = (travelled + SPEED * dt) % PATH_LENGTH;
      [camera.x, camera.y] = pointAt(travelled);
      const target = headingAt(travelled);
      const delta = Math.atan2(Math.sin(target - camera.angle), Math.cos(target - camera.angle));
      camera.angle += delta * Math.min(1, dt * 4);
      camera.bob += SPEED * dt * 6;
      lookOffset += (lookTarget - lookOffset) * Math.min(1, dt * 3);
    };

    const reportStats = (now: number) => {
      frames++;
      if (now - statsTime < 500 || !statsRef?.current) return;
      const fps = Math.round((frames * 1000) / (now - statsTime));
      statsRef.current.textContent = `${fps} fps · ${width} rays/frame`;
      frames = 0;
      statsTime = now;
    };

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (isVisible && !document.hidden) {
        update(dt);
        draw();
        reportStats(now);
      }
      frameId = requestAnimationFrame(loop);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.round(Math.min(MAX_RENDER_WIDTH, Math.max(MIN_RENDER_WIDTH, rect.width / 3)));
      height = Math.max(90, Math.round((width * rect.height) / Math.max(rect.width, 1)));
      canvas.width = width;
      canvas.height = height;
      if (reducedMotion) draw();
    };

    const onPointerMove = (event: PointerEvent) => {
      lookTarget = (event.clientX / window.innerWidth - 0.5) * 0.5;
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    const resizeObserver = new ResizeObserver(resize);
    visibilityObserver.observe(canvas);
    resizeObserver.observe(canvas);
    resize();

    if (reducedMotion) {
      draw();
    } else {
      window.addEventListener("pointermove", onPointerMove);
      frameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frameId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [minimapRef, statsRef]);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full [image-rendering:pixelated]" />
  );
}
