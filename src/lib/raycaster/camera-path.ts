export type Point = [number, number];

/** Closed loop through the corridors (cell centers) that covers the whole map. */
export const WAYPOINTS: Point[] = [
  [1.5, 3.5],
  [12.5, 3.5],
  [12.5, 7.5],
  [10.5, 7.5],
  [10.5, 10.5],
  [5.5, 10.5],
  [5.5, 7.5],
  [3.5, 7.5],
  [3.5, 12.5],
  [1.5, 12.5],
  [1.5, 14.5],
  [14.5, 14.5],
  [14.5, 12.5],
  [13.5, 12.5],
  [13.5, 4.5],
  [14.5, 4.5],
  [14.5, 1.5],
  [1.5, 1.5],
];

/** Adds anchor points around each corner so the smoothing never cuts into a wall. */
function withCornerAnchors(points: Point[], radius: number): Point[] {
  return points.flatMap(([x, y], i) => {
    const [px, py] = points[(i - 1 + points.length) % points.length];
    const [nx, ny] = points[(i + 1) % points.length];
    const inLength = Math.hypot(x - px, y - py);
    const outLength = Math.hypot(nx - x, ny - y);
    const before: Point = [x - ((x - px) / inLength) * radius, y - ((y - py) / inLength) * radius];
    const after: Point = [x + ((nx - x) / outLength) * radius, y + ((ny - y) / outLength) * radius];
    return [before, [x, y], after];
  });
}

/** Chaikin corner cutting for a closed polyline. */
function chaikin(points: Point[], iterations: number): Point[] {
  let result = points;
  for (let n = 0; n < iterations; n++) {
    result = result.flatMap(([ax, ay], i): Point[] => {
      const [bx, by] = result[(i + 1) % result.length];
      return [
        [ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25],
        [ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75],
      ];
    });
  }
  return result;
}

export const CAMERA_PATH = chaikin(withCornerAnchors(WAYPOINTS, 0.5), 3);

const cumulative = CAMERA_PATH.map(() => 0);
for (let i = 1; i < CAMERA_PATH.length; i++) {
  const [ax, ay] = CAMERA_PATH[i - 1];
  const [bx, by] = CAMERA_PATH[i];
  cumulative[i] = cumulative[i - 1] + Math.hypot(bx - ax, by - ay);
}

const [firstX, firstY] = CAMERA_PATH[0];
const [lastX, lastY] = CAMERA_PATH[CAMERA_PATH.length - 1];

export const PATH_LENGTH = cumulative[cumulative.length - 1] + Math.hypot(firstX - lastX, firstY - lastY);

/** Point at a given distance along the loop (wraps around). */
export function pointAt(distance: number): Point {
  const d = ((distance % PATH_LENGTH) + PATH_LENGTH) % PATH_LENGTH;
  let i = cumulative.findIndex((length) => length > d) - 1;
  if (i < 0) i = CAMERA_PATH.length - 1;

  const [ax, ay] = CAMERA_PATH[i];
  const [bx, by] = CAMERA_PATH[(i + 1) % CAMERA_PATH.length];
  const start = cumulative[i];
  const end = i + 1 < CAMERA_PATH.length ? cumulative[i + 1] : PATH_LENGTH;
  const t = (d - start) / Math.max(end - start, 1e-6);
  return [ax + (bx - ax) * t, ay + (by - ay) * t];
}
