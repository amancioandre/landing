import { describe, expect, it } from "vitest";
import { placeCard } from "./card-place";

const screen = { width: 800, height: 900 };
const size = { width: 240, height: 300 };
const BAR = 96;
const index = { x: 600, y: 190, width: 180, height: 140 };   // the index in the sky, at the right

describe("where a card hangs (it must never cover the index or another waypoint)", () => {
  it("hangs above its waypoint, to the right of its line, when that side is clear", () => {
    expect(placeCard({ at: { x: 200, y: 600 }, size, screen, top: BAR, obstacles: [index] }))
      .toEqual({ side: "right", left: 200, top: 270 });
  });

  it("moves to the left of its line when the right side would cover the index", () => {
    expect(placeCard({ at: { x: 470, y: 600 }, size, screen, top: BAR, obstacles: [index] }))
      .toEqual({ side: "left", left: 230, top: 270 });
  });

  it("moves to the left near the screen's right edge", () => {
    expect(placeCard({ at: { x: 700, y: 750 }, size, screen, top: BAR, obstacles: [] })?.side).toBe("left");
  });

  it("does not cover another waypoint", () => {
    const four = { x: 330, y: 560, width: 24, height: 18 };
    expect(placeCard({ at: { x: 350, y: 600 }, size, screen, top: BAR, obstacles: [four] })).toBeNull();
  });

  it("gives up (and opens as a sheet) when no side is clear", () => {
    const wide = { x: 0, y: 100, width: 800, height: 200 };
    expect(placeCard({ at: { x: 400, y: 600 }, size, screen, top: BAR, obstacles: [wide] })).toBeNull();
  });

  it("gives up when the card can't fit between the bar and its waypoint", () => {
    expect(placeCard({ at: { x: 200, y: 300 }, size, screen, top: BAR, obstacles: [] })).toBeNull();
  });
});
