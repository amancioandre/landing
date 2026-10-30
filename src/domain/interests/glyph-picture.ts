// A photo drawn in the range's glyphs with one element in focus: high contrast at its heart, thinning to empty
// paper toward its reach, so the picture never has a box (Andre: "any hard lines break the magic").
export interface Focus { cx: number; cy: number; rx: number; ry: number }   // as fractions of the frame
export interface Sample { u: number; v: number; lum: number; mean: number } // position, tone, and the tone around it
export interface Touch { localContrast: number; low: number; high: number; fadeFrom: number; fadeTo: number; maxInk: number; floor: number }

// Softer than the first canvas version, which Andre found too strong: less local contrast, a wider tone range,
// a longer fade, and never full ink.
export const SOFT: Touch = { localContrast: 0.3, low: 0.3, high: 0.85, fadeFrom: 0.45, fadeTo: 1.05, maxInk: 0.82, floor: 0.08 };

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** How much ink (0–1) a cell gets. */
export function inkAt({ u, v, lum, mean }: Sample, f: Focus, t: Touch): number {
  const reach = Math.hypot((u - f.cx) / f.rx, (v - f.cy) / f.ry);
  const keep = 1 - smooth(t.fadeFrom, t.fadeTo, reach);
  const tone = 1 - lum, local = 0.5 + (mean - lum) * 2.4;   // darker than its surroundings stands out
  const ink = smooth(t.low, t.high, tone * (1 - t.localContrast) + local * t.localContrast) * keep * t.maxInk;
  return ink < t.floor ? 0 : ink;
}
