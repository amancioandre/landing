import { describe, expect, it } from "vitest";
import { estimatePlace, isNight, solarElevation } from "./sun";

const VANCOUVER = { lat: 49.28, lon: -123.12 };

describe("the sun's height", () => {
  it("stands about 66.5° over the equator at noon on the June solstice", () => {
    expect(solarElevation(new Date("2026-06-21T12:02:00Z"), { lat: 0, lon: 0 })).toBeCloseTo(66.5, 0);
  });

  it("is below the horizon at midnight", () => {
    expect(solarElevation(new Date("2026-06-21T07:00:00Z"), VANCOUVER)).toBeLessThan(0);
  });
});

describe("night begins around sunset, by the season (ADR 0018)", () => {
  it("is still day at 9 pm in Vancouver on the longest day", () => {
    expect(isNight(new Date("2026-06-22T04:00:00Z"), VANCOUVER)).toBe(false);   // 21:00 PDT
  });

  it("is night by 10 pm that same evening", () => {
    expect(isNight(new Date("2026-06-22T05:00:00Z"), VANCOUVER)).toBe(true);    // 22:00 PDT
  });

  it("is already night at 4:45 pm on the shortest day", () => {
    expect(isNight(new Date("2026-12-22T00:00:00Z"), VANCOUVER)).toBe(false);   // 16:00 PST
    expect(isNight(new Date("2026-12-22T00:45:00Z"), VANCOUVER)).toBe(true);    // 16:45 PST
  });
});

describe("estimating where the visitor is from their time zone", () => {
  const KNOWN = { "America/Vancouver": [49.28, -123.12] as const };

  it("uses the zone's city when it is known", () => {
    expect(estimatePlace("America/Vancouver", 480, KNOWN, [])).toEqual({ lat: 49.28, lon: -123.12 });
  });

  it("otherwise takes the longitude from the clock's offset and a temperate latitude", () => {
    expect(estimatePlace("Europe/Somewhere", -60, KNOWN, [])).toEqual({ lat: 45, lon: 15 });
  });

  it("puts southern zones south of the equator", () => {
    expect(estimatePlace("Australia/Nowhere", -600, KNOWN, ["Australia/"]).lat).toBe(-35);
  });
});
