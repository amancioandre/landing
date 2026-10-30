import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import { THEMES, TEXT_ROLES } from "./tokens";

// WCAG AA for normal text. The red is text too ("write to me"), so it is held to the same bar (ADR 0012).
const AA = 4.5;

describe.each(Object.entries(THEMES))("the %s theme", (_name, theme) => {
  it.each(TEXT_ROLES)("keeps %s readable on paper", (role) => {
    expect(contrastRatio(theme[role], theme.paper)).toBeGreaterThanOrEqual(AA);
  });
});

describe("day and night", () => {
  it("share the same roles, so every component works in both", () => {
    expect(Object.keys(THEMES.night).sort()).toEqual(Object.keys(THEMES.day).sort());
  });

  it("keeps the night's words gentler than white (Andre: \"use less white\")", () => {
    expect(THEMES.night.ink).not.toBe("#eeebe5");
    expect(contrastRatio(THEMES.night.ink, THEMES.night.paper)).toBeLessThan(contrastRatio("#eeebe5", THEMES.night.paper));
  });
});
