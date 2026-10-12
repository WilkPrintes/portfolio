/** 16×16 grid. `0` is empty, `1` a graphite wall, `2` an accent (amber) wall. */
export const MAP = [
  "1111111111111111",
  "1000000000000001",
  "1020020000200201",
  "1000000000000001",
  "1000111001110001",
  "1000100000010001",
  "1200100000010021",
  "1000000220000001",
  "1000000220000001",
  "1200100000010021",
  "1000100000010001",
  "1000111001110001",
  "1000000000000001",
  "1020020000200201",
  "1000000000000001",
  "1111111111111111",
];

export type Tile = "0" | "1" | "2";
export type Wall = Exclude<Tile, "0">;
export type RGB = [number, number, number];

export const WALL_COLORS: Record<Wall, RGB> = {
  "1": [96, 96, 108],
  "2": [255, 176, 0],
};

export const FOG: RGB = [12, 12, 13];

export function tileAt(x: number, y: number): Tile {
  return (MAP[Math.floor(y)]?.[Math.floor(x)] as Tile | undefined) ?? "1";
}
