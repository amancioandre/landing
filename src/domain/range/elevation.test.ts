import { describe, expect, it } from "vitest";
import { boldFor, fogStrength, glyphCell, pickElevation, rampFor } from "./elevation";

describe("the screen's shape sets the elevation (ADR 0004)", () => {
  it("stands tall screens in the valley", () => {
    expect(pickElevation(390, 844)).toBe("valley");
  });

  it("shows very wide, short screens the whole landscape", () => {
    expect(pickElevation(844, 390)).toBe("landscape");
  });

  it("puts everything else on the ridge", () => {
    expect(pickElevation(1440, 900)).toBe("ridge");
    expect(pickElevation(768, 1024)).toBe("valley");
    expect(pickElevation(1000, 1000)).toBe("ridge");
  });
});

describe("the glyphs at each elevation", () => {
  it("uses the full ramp on the ridge and round glyphs elsewhere, eleven steps each", () => {
    expect(rampFor("ridge")).toBe(" .,:;!io%#@");
    expect(rampFor("valley")).toBe(" ..::-+oo*O");
    expect(rampFor("landscape")).toHaveLength(11);
  });

  it("draws 5px cells on the ridge and 4px elsewhere", () => {
    expect(glyphCell("ridge")).toBe(5);
    expect(glyphCell("valley")).toBe(4);
  });

  it("gives the ridge's larger cells a heavier bold stroke", () => {
    expect(boldFor("ridge").stroke).toBeGreaterThan(boldFor("valley").stroke);
  });
});

describe("fog by width (ADR 0008)", () => {
  it("is full from 1440px and lightest at phone width", () => {
    expect(fogStrength(1600)).toBe(1);
    expect(fogStrength(1440)).toBe(1);
    expect(fogStrength(390)).toBe(0);
    expect(fogStrength(915)).toBeCloseTo(0.5, 2);
  });
});
