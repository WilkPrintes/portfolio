import { tileAt, type Wall } from "./map";

export type RayHit = {
  /** Perpendicular distance to the wall (avoids the fisheye effect). */
  dist: number;
  /** 0 when an x-side was hit, 1 for a y-side. */
  side: 0 | 1;
  tile: Wall;
  /** Where along the wall the ray hit, from 0 to 1. */
  wallX: number;
};

const MAX_STEPS = 64;

/** Digital Differential Analysis: walks the grid cell by cell until it hits a wall. */
export function castRay(px: number, py: number, rx: number, ry: number): RayHit {
  let mapX = Math.floor(px);
  let mapY = Math.floor(py);
  const deltaX = rx === 0 ? 1e30 : Math.abs(1 / rx);
  const deltaY = ry === 0 ? 1e30 : Math.abs(1 / ry);
  const stepX = rx < 0 ? -1 : 1;
  const stepY = ry < 0 ? -1 : 1;
  let sideX = rx < 0 ? (px - mapX) * deltaX : (mapX + 1 - px) * deltaX;
  let sideY = ry < 0 ? (py - mapY) * deltaY : (mapY + 1 - py) * deltaY;
  let side: 0 | 1 = 0;

  for (let i = 0; i < MAX_STEPS; i++) {
    if (sideX < sideY) {
      sideX += deltaX;
      mapX += stepX;
      side = 0;
    } else {
      sideY += deltaY;
      mapY += stepY;
      side = 1;
    }

    const tile = tileAt(mapX, mapY);
    if (tile !== "0") {
      const dist = side === 0 ? sideX - deltaX : sideY - deltaY;
      const hitAlongWall = side === 0 ? py + dist * ry : px + dist * rx;
      return { dist, side, tile, wallX: hitAlongWall - Math.floor(hitAlongWall) };
    }
  }

  return { dist: MAX_STEPS, side: 0, tile: "1", wallX: 0 };
}
