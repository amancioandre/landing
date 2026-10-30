import { describe, expect, it } from "vitest";
import { glyphIcon, ICON_DAY, ICON_NIGHT, pixelIcon } from "./svg";
import { THEMES } from "../../design/tokens";

const squares = [{ x: 0, y: 0, size: 1, role: "ink" as const }, { x: 2, y: 3, size: 2, role: "signal" as const }];

describe("the icon's colours are the page's", () => {
  it("takes paper, ink and signal from the day and night themes", () => {
    expect(ICON_DAY).toEqual({ paper: THEMES.day.paper, ink: THEMES.day.ink, signal: THEMES.day.signal });
    expect(ICON_NIGHT).toEqual({ paper: THEMES.night.paper, ink: THEMES.night.ink, signal: THEMES.night.signal });
  });
});

describe("the small icon, pixel for pixel", () => {
  it("draws every square on a paper tile, with crisp edges", () => {
    const svg = pixelIcon(squares, 16, ICON_DAY);
    expect(svg).toContain('viewBox="0 0 16 16"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).toContain(`fill:${ICON_DAY.paper}`);
    expect(svg.match(/<rect /g)).toHaveLength(3);
  });

  it("turns to night when the browser's bar is dark", () => {
    const svg = pixelIcon(squares, 16, ICON_DAY, ICON_NIGHT);
    expect(svg).toMatch(new RegExp(`@media \\(prefers-color-scheme: dark\\)\\{[^}]*\\.p\\{fill:${ICON_NIGHT.paper}`));
  });

  it("stays in day colours when it is drawn once, for a fixed picture", () => {
    expect(pixelIcon(squares, 16, ICON_DAY)).not.toContain("prefers-color-scheme");
  });
});

describe("the large icon, in glyphs", () => {
  it("sets one line of glyphs per row, each glyph in its own cell", () => {
    const svg = glyphIcon([" @", "i:"], 180, ICON_DAY);
    expect(svg.match(/<text /g)).toHaveLength(2);
    expect(svg).toContain('x="0 90"');
  });

  it("marks the waypoint as one glyph cell, as small as a red number on the page", () => {
    const rows = Array.from({ length: 30 }, () => " ".repeat(30));
    const red = glyphIcon(rows, 180, ICON_DAY).match(/<rect class="s"[^>]*width="([\d.]+)"/);
    expect(Number(red?.[1])).toBeCloseTo(6.6, 1);
  });

  it("can draw inside a safe zone, for icons the phone crops to a circle", () => {
    const svg = glyphIcon([" @"], 512, ICON_DAY, { inset: 0.1 });
    expect(svg).toContain('transform="translate(51.2 51.2) scale(0.8)"');
  });
});
