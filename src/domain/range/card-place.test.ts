import { describe, expect, it } from "vitest";
import { placeCard, placeCards } from "./card-place";

const screen = { width: 800, height: 900 };
const size = { width: 240, height: 300 };
const BAR = 96;
const index = { x: 600, y: 190, width: 180, height: 140 };   // the index in the sky, at the right

describe("where a card hangs (beside its waypoint's number, on a red line, never over the index)", () => {
  it("hangs to the right of its number, centred on it, the line running across to its edge", () => {
    expect(placeCard({ at: { x: 200, y: 600 }, size, screen, top: BAR, avoid: [index] }))
      .toEqual({ side: "right", left: 240, top: 426, line: { left: 210, width: 30, y: 576 } });
  });

  it("moves to the left of its number near the screen's right edge, the line running back to it", () => {
    expect(placeCard({ at: { x: 700, y: 600 }, size, screen, top: BAR, avoid: [] }))
      .toEqual({ side: "left", left: 420, top: 426, line: { left: 660, width: 30, y: 576 } });
  });

  it("moves to the left when the right side would cover the index", () => {
    expect(placeCard({ at: { x: 400, y: 300 }, size, screen, top: BAR, avoid: [index] })?.side).toBe("left");
  });

  it("stays below the bar when its number stands high", () => {
    expect(placeCard({ at: { x: 200, y: 200 }, size, screen, top: BAR, avoid: [] })?.top).toBe(BAR);
  });

  it("stays above the foot of the range when its number stands low", () => {
    expect(placeCard({ at: { x: 200, y: 880 }, size, screen, top: BAR, avoid: [] })?.top).toBe(584);
  });

  it("gives up (and opens as a sheet) when the card is taller than the range has room for", () => {
    expect(placeCard({ at: { x: 200, y: 600 }, size: { width: 240, height: 800 }, screen, top: BAR, avoid: [] })).toBeNull();
  });

  it("gives up when either side would cover the index", () => {
    const wide = { x: 0, y: 100, width: 800, height: 600 };
    expect(placeCard({ at: { x: 400, y: 600 }, size, screen, top: BAR, avoid: [wide] })).toBeNull();
  });
});

describe("how the range presents its cards (one way for all of them, never a mix)", () => {
  const card = (x: number, y: number) => ({ at: { x, y }, size, avoid: [index] });

  it("hangs every card when every card can hang", () => {
    expect(placeCards({ cards: [card(200, 600), card(700, 600)], screen, top: BAR })?.map((p) => p.side))
      .toEqual(["right", "left"]);
  });

  it("opens every card as a sheet when even one of them can't hang", () => {
    const tall = { at: { x: 200, y: 600 }, size: { width: 240, height: 800 }, avoid: [] };
    expect(placeCards({ cards: [tall, card(200, 600)], screen, top: BAR })).toBeNull();
  });
});
