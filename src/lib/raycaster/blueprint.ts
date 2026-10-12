import { CAMERA_PATH, PATH_LENGTH, pointAt } from "./camera-path";
import { castRay } from "./cast-ray";
import { MAP } from "./map";
import { FOV_PLANE } from "./render";

const TRAIL_STEP = 0.2;
const CONE_RAYS = 16;
const LOOK_AHEAD = 0.6;

const COLORS = {
  wall: "rgb(255 255 255 / 0.075)",
  accentWall: "rgb(255 176 0 / 0.22)",
  path: "rgb(255 255 255 / 0.07)",
  trail: "rgb(255 176 0 / 0.5)",
  cone: "rgb(255 176 0 / 0.07)",
  dot: "#ffb000",
};

export type BlueprintLayout = {
  /** Top-left corner of the map, in CSS pixels. */
  x: number;
  y: number;
  /** Size of one map cell, in CSS pixels. */
  cell: number;
};

/** Fits the square map in the viewport, centered. */
export function blueprintLayout(width: number, height: number, coverage = 0.92): BlueprintLayout {
  const size = Math.min(width, height) * coverage;
  const cell = size / MAP.length;
  return { x: (width - size) / 2, y: (height - size) / 2, cell };
}

/** Outer edges of every wall cell that faces an empty cell, so walls read as a floor plan. */
function drawWalls(ctx: CanvasRenderingContext2D, { x, y, cell }: BlueprintLayout) {
  const sides: [number, number, (cx: number, cy: number) => [number, number, number, number]][] = [
    [0, -1, (cx, cy) => [cx, cy, cx + cell, cy]],
    [0, 1, (cx, cy) => [cx, cy + cell, cx + cell, cy + cell]],
    [-1, 0, (cx, cy) => [cx, cy, cx, cy + cell]],
    [1, 0, (cx, cy) => [cx + cell, cy, cx + cell, cy + cell]],
  ];

  for (const tile of ["1", "2"] as const) {
    ctx.strokeStyle = tile === "2" ? COLORS.accentWall : COLORS.wall;
    ctx.beginPath();
    MAP.forEach((row, my) => {
      [...row].forEach((value, mx) => {
        if (value !== tile) return;
        const cx = x + mx * cell;
        const cy = y + my * cell;
        for (const [dx, dy, segment] of sides) {
          const neighbour = MAP[my + dy]?.[mx + dx];
          if (neighbour !== "0") continue;
          const [x1, y1, x2, y2] = segment(cx, cy);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      });
    });
    ctx.stroke();
  }
}

/**
 * Draws the maze as a faint floor plan with the camera path, the part already travelled
 * and the camera itself (with its field of view) at `progress` (0–1) along the path.
 */
export function renderBlueprint(
  ctx: CanvasRenderingContext2D,
  layout: BlueprintLayout,
  progress: number,
  width: number,
  height: number,
) {
  const { x, y, cell } = layout;
  const toScreen = ([px, py]: [number, number]): [number, number] => [x + px * cell, y + py * cell];
  const travelled = Math.max(0, Math.min(1, progress)) * PATH_LENGTH;

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;
  drawWalls(ctx, layout);

  // Full path, dashed and barely visible.
  ctx.save();
  ctx.setLineDash([3, 6]);
  ctx.strokeStyle = COLORS.path;
  ctx.beginPath();
  CAMERA_PATH.forEach((point, index) => {
    const [sx, sy] = toScreen(point);
    if (index === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // Trail of what has been scrolled through.
  ctx.strokeStyle = COLORS.trail;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let distance = 0; distance <= travelled; distance += TRAIL_STEP) {
    const [sx, sy] = toScreen(pointAt(distance));
    if (distance === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  const [cx, cy] = pointAt(travelled);
  const [sx, sy] = toScreen([cx, cy]);
  ctx.lineTo(sx, sy);
  ctx.stroke();

  // Field of view: a fan of rays cast from the camera, like the hero's debug panel.
  const [ax, ay] = pointAt(travelled + LOOK_AHEAD);
  const angle = Math.atan2(ay - cy, ax - cx);
  const dirX = Math.cos(angle);
  const dirY = Math.sin(angle);
  ctx.fillStyle = COLORS.cone;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  for (let i = 0; i <= CONE_RAYS; i++) {
    const cameraX = (2 * i) / CONE_RAYS - 1;
    const rx = dirX - dirY * FOV_PLANE * cameraX;
    const ry = dirY + dirX * FOV_PLANE * cameraX;
    const { dist } = castRay(cx, cy, rx, ry);
    ctx.lineTo(sx + rx * dist * cell, sy + ry * dist * cell);
  }
  ctx.closePath();
  ctx.fill();

  // Camera position.
  ctx.save();
  ctx.fillStyle = COLORS.dot;
  ctx.shadowColor = COLORS.dot;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
