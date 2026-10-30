// The smaller and taller the screen, the lower we stand (ADR 0004). Crossing a threshold redraws plainly.
export type Elevation = "valley" | "ridge" | "landscape";

export function pickElevation(width: number, height: number): Elevation {
  const ratio = width / height;
  if (ratio < 0.9) return "valley";
  if (ratio > 2) return "landscape";
  return "ridge";
}

// One glyph per Ansel Adams zone, X (paper) down to 0. Below the ridge, cells are 4px and only round glyphs read.
const RAMPS = { full: " .,:;!io%#@", round: " ..::-+oo*O" } as const;
export const rampFor = (e: Elevation) => (e === "ridge" ? RAMPS.full : RAMPS.round);
export const glyphCell = (e: Elevation) => (e === "ridge" ? 5 : 4);

// Near ground is drawn in bold (ADR 0006); the ridge's larger cells need a heavier stroke to show it.
export const boldFor = (e: Elevation) => (e === "ridge" ? { from: 0.42, stroke: 0.8 } : { from: 0.5, stroke: 0.45 });

// Fog at full strength from 1440px wide, easing to its lightest at phone width (ADR 0008).
export const fogStrength = (width: number) => Math.min(1, Math.max(0, (width - 390) / (1440 - 390)));
