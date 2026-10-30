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

describe("the two themes", () => {
  it("share the same roles, so every component works in both", () => {
    expect(Object.keys(THEMES.dark).sort()).toEqual(Object.keys(THEMES.light).sort());
  });
});
