// A photo drawn in the range's glyphs. The whole frame is drawn: its own light areas stay as empty paper, and only
// the outermost band of the frame thins out softly, so the picture never has a hard edge and nothing is pulled to
// the centre (Andre: "I didn't mean to concentrate everything in the center and emanate in a radius").
export interface Sample { u: number; v: number; lum: number; mean: number } // position, tone, and the tone around it
export interface Touch { localContrast: number; low: number; high: number; margin: number; maxInk: number; floor: number }

// Softer than the first canvas version, which Andre found too strong: less local contrast, a wider tone range, never full ink.
export const SOFT: Touch = { localContrast: 0.3, low: 0.3, high: 0.85, margin: 0.1, maxInk: 0.82, floor: 0.08 };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** How much ink (0–1) a cell gets. */
export function inkAt({ u, v, lum, mean }: Sample, t: Touch): number {
  const keep = smooth(0, t.margin, Math.min(u, 1 - u, v, 1 - v));
  const tone = 1 - lum, local = 0.5 + (mean - lum) * 2.4;   // darker than its surroundings stands out
  const ink = smooth(t.low, t.high, tone * (1 - t.localContrast) + local * t.localContrast) * keep * t.maxInk;
  return ink < t.floor ? 0 : ink;
}

// The frontier: the photo shows only inside the focus slot. As a card crosses the slot's left or right edge, the
// part outside turns to glyphs. Returns the visible span as fractions of the card's width.
export interface Span { left: number; width: number }
export function photoSpan(card: Span, slot: Span): { from: number; to: number } {
  const from = clamp01((slot.left - card.left) / card.width);
  const to = clamp01((slot.left + slot.width - card.left) / card.width);
  return { from, to: Math.max(from, to) };
}

// Seventy glyphs from blank to densest (Paul Bourke's ramp, lightest first): many more steps than the range's eleven,
// so a portrait keeps its detail and its tones move smoothly (Andre: more resolution and characters).
export const PICTURE_RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

export const glyphFor = (ink: number) => PICTURE_RAMP[Math.round(Math.min(1, Math.max(0, ink)) * (PICTURE_RAMP.length - 1))];
