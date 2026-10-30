import { describe, expect, it } from "vitest";
import { glyphFor, inkAt, PICTURE_RAMP, SOFT } from "./glyph-picture";

const focus = { cx: 0.5, cy: 0.5, rx: 0.3, ry: 0.4 };

describe("a photo drawn in glyphs, one element in focus (Andre: negative space, no hard lines)", () => {
  it("leaves the paper empty beyond the element's reach", () => {
    expect(inkAt({ u: 0.02, v: 0.02, lum: 0.1, mean: 0.5 }, focus, SOFT)).toBe(0);
  });

  it("keeps the element's darks in ink at its centre", () => {
    expect(inkAt({ u: 0.5, v: 0.5, lum: 0.1, mean: 0.5 }, focus, SOFT)).toBeGreaterThan(0.4);
  });

  it("keeps light areas empty even inside the element", () => {
    expect(inkAt({ u: 0.5, v: 0.5, lum: 0.95, mean: 0.9 }, focus, SOFT)).toBe(0);
  });

  it("thins toward the edge of the element instead of stopping on a line", () => {
    const at = (u: number) => inkAt({ u, v: 0.5, lum: 0.1, mean: 0.5 }, focus, SOFT);
    expect(at(0.5)).toBeGreaterThan(at(0.7));
    expect(at(0.7)).toBeGreaterThan(at(0.82));
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
