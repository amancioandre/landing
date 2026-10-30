import { describe, expect, it } from "vitest";
import { clampToScreen, cover, innerRect, toScreen } from "./geometry";

describe("covering the screen with a plate", () => {
  it("scales the plate to cover and centres it across", () => {
    const r = cover({ width: 2000, height: 1000 }, { width: 1000, height: 1000 }, 0.5);
    expect(r).toEqual({ x: -500, y: 0, width: 2000, height: 1000 });
  });

  it("anchors the plate vertically by anchorY", () => {
    const r = cover({ width: 1000, height: 2000 }, { width: 1000, height: 1000 }, 0.78);
    expect(r.y).toBeCloseTo(-780, 6);
  });
});

describe("placing a point from the original picture", () => {
  const plateBox = { x: 0, y: 0, width: 2000, height: 1131 };

  it("finds where the original sits inside the plate", () => {
    expect(innerRect(plateBox, [0.5, 0, 0.5, 1])).toEqual({ x: 1000, y: 0, width: 1000, height: 1131 });
  });

  it("maps a point in the original's 2000-wide frame onto the screen", () => {
    const original = { x: 100, y: 50, width: 1000, height: 565.5 };
    const p = toScreen([1000, 565.5], original, { refWidth: 2000, aspect: 0.5655 });
    expect(p.x).toBeCloseTo(600, 6);
    expect(p.y).toBeCloseTo(50 + 282.75 / 1, 0);
  });
});

describe("keeping a waypoint on screen", () => {
  it("never lets a number fall off either edge", () => {
    expect(clampToScreen(-10, 390)).toBe(22);
    expect(clampToScreen(400, 390)).toBe(368);
    expect(clampToScreen(200, 390)).toBe(200);
  });
});
