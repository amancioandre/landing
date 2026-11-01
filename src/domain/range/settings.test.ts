import { describe, expect, it } from "vitest";
import { AS_DRAWN, cellFor, lookOf, rampOf, withSetting } from "./settings";

describe("the range's settings (canvas row 21, A: a small panel at the range's lower right)", () => {
  it("start as the range is drawn today: every amount at its middle, the wind from the west, the visitor's clock", () => {
    expect(AS_DRAWN).toMatchObject({ fog: 0.5, wind: 0.5, windFrom: "west", clouds: 0.5, time: "clock", fire: 0.5,
      smoke: 0.5, nightInk: "starlight", stars: 0.5, glyphSize: 0.5, characters: "as drawn", contrast: 0.5, mist: 0.5 });
  });

  it("as drawn, ask the drawing for exactly what it does today", () => {
    expect(lookOf(AS_DRAWN)).toEqual({ fog: 1, wind: 1, windDirection: 1, clouds: 1, fire: 1, smoke: 1,
      ink: [0.66, 0.64, 0.6], nearLift: true, stars: 1, contrast: 1, mist: 1 });
  });

  it("an amount at either end runs from none to twice today's", () => {
    expect(lookOf(withSetting(AS_DRAWN, "fog", 0)).fog).toBe(0);
    expect(lookOf(withSetting(AS_DRAWN, "clouds", 1)).clouds).toBe(2);
  });

  it("keeps an amount between none and full, however it is asked", () => {
    expect(withSetting(AS_DRAWN, "wind", 3).wind).toBe(1);
    expect(withSetting(AS_DRAWN, "wind", -1).wind).toBe(0);
    expect(withSetting(AS_DRAWN, "wind", Number.NaN).wind).toBe(0.5);
  });

  it("turns the wind round when it comes from the east", () => {
    expect(lookOf(withSetting(AS_DRAWN, "windFrom", "east")).windDirection).toBe(-1);
  });

  it("gives each night ink its colour from row 7; only Starlight lifts the near ground", () => {
    expect(lookOf(withSetting(AS_DRAWN, "nightInk", "moonlight"))).toMatchObject({ ink: [0.64, 0.62, 0.59], nearLift: false });
    expect(lookOf(withSetting(AS_DRAWN, "nightInk", "faint"))).toMatchObject({ ink: [0.42, 0.41, 0.39], nearLift: false });
  });

  it("sizes the glyphs from the elevation's own cell, from a little over half to half again as large", () => {
    expect(cellFor(5, 0.5)).toBe(5);
    expect(cellFor(5, 0)).toBe(3);
    expect(cellFor(4, 1)).toBe(6);
  });

  it("draws with the elevation's own characters unless another set is chosen", () => {
    expect(rampOf("as drawn", " .,:;!io%#@")).toBe(" .,:;!io%#@");
    expect(rampOf("round", " .,:;!io%#@")).toBe(" ..::-+oo*O");
    expect(rampOf("full", " ..::-+oo*O")).toBe(" .,:;!io%#@");
  });
});
