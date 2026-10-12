import { CAMERA_PATH } from "./camera-path";
import { castRay } from "./cast-ray";
import { FOG, MAP, WALL_COLORS } from "./map";

export const FOV_PLANE = 0.66;
const MINIMAP_RAYS = 24;

export type Camera = {
  x: number;
  y: number;
  angle: number;
  /** Phase of the walking bob, in radians. */
  bob: number;
};

const mix = (color: number, fog: number, light: number) => Math.round(color * light + fog * (1 - light));

/** Renders one frame: sky, floor and one wall column per ray. */
export function renderScene(ctx: CanvasRenderingContext2D, camera: Camera, width: number, height: number) {
  const dirX = Math.cos(camera.angle);
  const dirY = Math.sin(camera.angle);
  const planeX = -dirY * FOV_PLANE;
  const planeY = dirX * FOV_PLANE;
  const horizon = height / 2 + Math.sin(camera.bob) * height * 0.006;
  // Keeps pixels square without letting walls get too short on portrait screens.
  const wallScale = Math.max(width / (2 * FOV_PLANE), height * 0.75);

  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#08080a");
  sky.addColorStop(1, "#151518");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, horizon);

  const floor = ctx.createLinearGradient(0, horizon, 0, height);
  floor.addColorStop(0, "#111113");
  floor.addColorStop(1, "#202024");
  ctx.fillStyle = floor;
  ctx.fillRect(0, horizon, width, height - horizon);

  for (let x = 0; x < width; x++) {
    const cameraX = (2 * x) / width - 1;
    const hit = castRay(camera.x, camera.y, dirX + planeX * cameraX, dirY + planeY * cameraX);
    const lineHeight = wallScale / Math.max(hit.dist, 0.0001);
    const top = horizon - lineHeight / 2;
    const [r, g, b] = WALL_COLORS[hit.tile];

    let light = 1 / (1 + hit.dist * hit.dist * 0.06);
    if (hit.side === 1) light *= 0.72;
    // Darker seams fake a brick texture without image lookups.
    const seam = hit.wallX * 4 - Math.floor(hit.wallX * 4);
    if (seam < 0.06) light *= 0.55;

    ctx.fillStyle = `rgb(${mix(r, FOG[0], light)},${mix(g, FOG[1], light)},${mix(b, FOG[2], light)})`;
    ctx.fillRect(x, top, 1, lineHeight);

    const glow = Math.min(1, light * 1.6);
    const edge = (c: number) => Math.round(c * glow + 255 * glow * 0.25 + FOG[0] * (1 - glow));
    ctx.fillStyle = `rgb(${edge(r)},${edge(g)},${edge(b)})`;
    ctx.fillRect(x, top, 1, 1);
    ctx.fillRect(x, top + lineHeight - 1, 1, 1);
  }
}

/** Top-down debug view: walls, the camera path and a sample of the cast rays. */
export function renderMinimap(ctx: CanvasRenderingContext2D, camera: Camera, travelled: number) {
  const { width, height } = ctx.canvas;
  const tile = width / MAP.length;

  ctx.fillStyle = "#0c0c0d";
  ctx.fillRect(0, 0, width, height);
  MAP.forEach((row, y) => {
    [...row].forEach((value, x) => {
      if (value === "0") return;
      ctx.fillStyle = value === "2" ? "rgba(255,176,0,0.8)" : "rgba(150,150,165,0.45)";
      ctx.fillRect(x * tile, y * tile, tile - 1, tile - 1);
    });
  });

  ctx.save();
  ctx.strokeStyle = "rgba(236,236,238,0.6)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = -travelled * tile;
  ctx.beginPath();
  CAMERA_PATH.forEach(([x, y], i) => (i ? ctx.lineTo(x * tile, y * tile) : ctx.moveTo(x * tile, y * tile)));
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  const px = camera.x * tile;
  const py = camera.y * tile;
  const dirX = Math.cos(camera.angle);
  const dirY = Math.sin(camera.angle);

  ctx.strokeStyle = "rgba(255,176,0,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= MINIMAP_RAYS; i++) {
    const cameraX = (2 * i) / MINIMAP_RAYS - 1;
    const rx = dirX - dirY * FOV_PLANE * cameraX;
    const ry = dirY + dirX * FOV_PLANE * cameraX;
    const { dist } = castRay(camera.x, camera.y, rx, ry);
    ctx.moveTo(px, py);
    ctx.lineTo(px + rx * dist * tile, py + ry * dist * tile);
  }
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(px - 2, py - 2, 4, 4);
}
