import { describe, expect, it } from "vitest";
import { glyphFor, inkAt, photoSpan, PICTURE_RAMP, SOFT } from "./glyph-picture";

const sample = (u: number, v: number, lum: number, mean = 0.5) => ({ u, v, lum, mean });

describe("a photo drawn in glyphs (Andre: negative space, no hard edges, nothing pulled to the centre)", () => {
  it("keeps the picture's darks anywhere in the frame, not only at its centre", () => {
    expect(inkAt(sample(0.2, 0.3, 0.1), SOFT)).toBeGreaterThan(0.4);
    expect(inkAt(sample(0.8, 0.75, 0.1), SOFT)).toBeGreaterThan(0.4);
  });

  it("leaves the picture's light areas as empty paper", () => {
    expect(inkAt(sample(0.5, 0.5, 0.95, 0.9), SOFT)).toBe(0);
  });

  it("thins softly at the frame's edge instead of stopping on a line", () => {
    const at = (u: number) => inkAt(sample(u, 0.5, 0.1), SOFT);
    expect(at(0.5)).toBeGreaterThan(at(0.04));
    expect(at(0.04)).toBeGreaterThan(at(0.005));
    expect(at(0)).toBe(0);
  });

  it("is softer than the first version Andre found too strong", () => {
    expect(SOFT.maxInk).toBeLessThan(1);
    expect(SOFT.localContrast).toBeLessThan(0.55);
  });
});

describe("the glyphs a picture is drawn in (Andre: more resolution and characters, for more detail)", () => {
  it("has many more steps than the range's eleven", () => {
    expect(PICTURE_RAMP.length).toBeGreaterThanOrEqual(40);
  });

  it("starts blank and ends on the densest glyph", () => {
    expect(glyphFor(0)).toBe(" ");
    expect(glyphFor(1)).toBe(PICTURE_RAMP.at(-1));
  });

  it("never repeats a glyph, so every step is a different weight", () => {
    expect(new Set(PICTURE_RAMP).size).toBe(PICTURE_RAMP.length);
  });

  it("picks a heavier glyph for more ink", () => {
    expect(PICTURE_RAMP.indexOf(glyphFor(0.8))).toBeGreaterThan(PICTURE_RAMP.indexOf(glyphFor(0.3)));
  });
});

describe("the frontier: a photo shows only inside the focus slot, and turns to glyphs as it crosses out", () => {
  const slot = { left: 200, width: 360 };

  it("shows whole while the card sits in the slot", () => {
    expect(photoSpan({ left: 200, width: 360 }, slot)).toEqual({ from: 0, to: 1 });
  });

  it("shows nowhere while the card waits outside the slot", () => {
    const right = photoSpan({ left: 616, width: 360 }, slot);
    expect(right.to - right.from).toBe(0);
    const left = photoSpan({ left: -216, width: 360 }, slot);
    expect(left.to - left.from).toBe(0);
  });

  it("is washed into glyphs from the left as the card crosses the slot's left edge", () => {
    expect(photoSpan({ left: 56, width: 360 }, slot)).toEqual({ from: 0.4, to: 1 });
  });

  it("is washed from the right as the card crosses the slot's right edge", () => {
    expect(photoSpan({ left: 344, width: 360 }, slot)).toEqual({ from: 0, to: 0.6 });
  });
});
