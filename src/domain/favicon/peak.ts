// The favicon is the range's own peak, sampled from the landscape plate (ADR 0026). Andre picked it on the canvas
// (2026-10-30): "Hands down option A".
export type Darkness = readonly (readonly number[])[];   // 0 paper to 1 ink, row by row
export type Role = "ink" | "signal";
export interface Square { x: number; y: number; size: number; role: Role }
export interface Crop { left: number; top: number; width: number; height: number }

// Where the peak stands in public/range/landscape.png, clear of the plate's faint lettering. Only the summit reads
// at 16 to 48 px, so the small drawings crop tighter.
export const PEAK: Crop = { left: 1370, top: 215, width: 460, height: 460 };
export const SUMMIT: Crop = { left: 1400, top: 225, width: 360, height: 360 };

const MIST = { from: 0.62, strength: 0.85 };

export function inMist(grid: Darkness): number[][] {
  const n = grid.length;
  return grid.map((row, y) => {
    const fog = Math.max(0, (y / n - MIST.from) / (1 - MIST.from));
    return row.map((v) => v * (1 - MIST.strength * fog));
  });
}

const ROCK = 0.48, SNOW = 0.22, HAZE = 0.12;

/** Rock in solid ink; the snow face and the haze as an ordered dither, the page's dotted light. */
export function inkAt(darkness: number, x: number, y: number): boolean {
  if (darkness > ROCK) return true;
  if (darkness > SNOW) return (x + y) % 2 === 0;
  if (darkness > HAZE) return x % 2 === 0 && y % 2 === 0;
  return false;
}

export function pixelSquares(grid: Darkness): Square[] {
  return grid.flatMap((row, y) => row.flatMap((v, x) => (inkAt(v, x, y) ? [{ x, y, size: 1, role: "ink" as const }] : [])));
}

const WAYPOINT_AT = { x: 0.16, y: 0.8 };

export function waypoint(n: number): Square {
  return { x: Math.round(WAYPOINT_AT.x * n), y: Math.round(WAYPOINT_AT.y * n), size: Math.max(2, Math.round(n / 8)), role: "signal" };
}

/** The red never touches the ink: a one-cell ring of paper clears around the waypoint. */
export function withWaypoint(squares: readonly Square[], n: number): Square[] {
  const red = waypoint(n);
  const clear = (s: Square) => s.x >= red.x - 1 && s.x <= red.x + red.size && s.y >= red.y - 1 && s.y <= red.y + red.size;
  return [...squares.filter((s) => !clear(s)), red];
}

// Large drawings are lighter than the page's range at the same size, so the glyphs take a little more ink.
const GLYPH_GAIN = 1.7;

export function glyphRows(grid: Darkness, ramp: string): string[] {
  const last = ramp.length - 1;
  // Rounding down keeps faint sky as paper, as in the drawing Andre picked.
  return grid.map((row) => row.map((v) => ramp[Math.floor(Math.min(1, v * GLYPH_GAIN) * last)]).join(""));
}

export const glyphGrid = (size: number) => Math.min(48, Math.round(size / 6));
