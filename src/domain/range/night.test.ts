import { describe, expect, it } from "vitest";
import { nookShown } from "./night";

describe("the embers in the nook (ADR 0018)", () => {
  it("show only at night", () => {
    expect(nookShown({ night: false, width: 1440 })).toBe(false);
  });

  it("show on bigger screens, from 1024px wide", () => {
    expect(nookShown({ night: true, width: 1440 })).toBe(true);
    expect(nookShown({ night: true, width: 1024 })).toBe(true);
  });

  it("stay off phones, held either way (Andre: \"too small\")", () => {
    expect(nookShown({ night: true, width: 390 })).toBe(false);
    expect(nookShown({ night: true, width: 844 })).toBe(false);
  });
});
