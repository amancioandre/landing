import { describe, expect, it } from "vitest";
import { glyphGrid, glyphRows, inkAt, inMist, pixelSquares, waypoint, withWaypoint } from "./peak";
import { rampFor } from "../range/elevation";

const flat = (n: number, v: number) => Array.from({ length: n }, () => Array.from({ length: n }, () => v));

describe("the peak drawn small (Andre picked it on the canvas: \"Hands down option A\")", () => {
  it("draws rock in solid ink", () => {
    expect([inkAt(0.6, 0, 0), inkAt(0.6, 1, 0), inkAt(0.6, 0, 1), inkAt(0.6, 1, 1)]).toEqual([true, true, true, true]);
  });

  it("dots the snow face on a checkerboard, the page's dotted light", () => {
    expect([inkAt(0.3, 0, 0), inkAt(0.3, 1, 0), inkAt(0.3, 0, 1), inkAt(0.3, 1, 1)]).toEqual([true, false, false, true]);
  });

  it("leaves only every other dot of every other row in the haze", () => {
    expect([inkAt(0.15, 0, 0), inkAt(0.15, 1, 0), inkAt(0.15, 0, 1), inkAt(0.15, 2, 2)]).toEqual([true, false, false, true]);
  });

  it("leaves the sky as paper", () => {
    expect(inkAt(0.05, 0, 0)).toBe(false);
  });

  it("turns every ink cell into one square of ink", () => {
    const squares = pixelSquares([[0.9, 0], [0, 0.9]]);
    expect(squares).toEqual([{ x: 0, y: 0, size: 1, role: "ink" }, { x: 1, y: 1, size: 1, role: "ink" }]);
  });
});

describe("mist rising from the bottom, as on the page", () => {
  it("leaves the summit as it is", () => {
    expect(inMist(flat(16, 0.8))[0][0]).toBe(0.8);
  });

  it("thins the foot of the picture", () => {
    const misty = inMist(flat(16, 0.8));
    expect(misty[15][0]).toBeLessThan(misty[10][0]);
    expect(misty[15][0]).toBeLessThan(0.8 / 3);
  });
});

describe("one red waypoint, the page's signal", () => {
  it("sits in the mist low on the left flank", () => {
    expect(waypoint(16)).toEqual({ x: 3, y: 13, size: 2, role: "signal" });
    expect(waypoint(32)).toEqual({ x: 5, y: 26, size: 4, role: "signal" });
  });

  it("never touches the ink: a ring of paper clears around it", () => {
    const ink = pixelSquares(flat(16, 0.9));
    const drawn = withWaypoint(ink, 16);
    const red = drawn.filter((s) => s.role === "signal");
    expect(red).toHaveLength(1);
    const near = drawn.filter((s) => s.role === "ink" && s.x >= 2 && s.x <= 5 && s.y >= 12 && s.y <= 15);
    expect(near).toEqual([]);
  });
});

describe("the peak drawn large, in the range's own glyphs", () => {
  it("uses only the range's characters, darkest as the last", () => {
    const ramp = rampFor("ridge");
    const rows = glyphRows([[0, 1], [0.3, 0.6]], ramp);
    expect(rows[0]).toBe(` ${ramp.at(-1)}`);
    for (const ch of rows.join("")) expect(ramp).toContain(ch);
  });

  it("keeps a cell about six pixels wide, at most forty-eight across", () => {
    expect(glyphGrid(180)).toBe(30);
    expect(glyphGrid(192)).toBe(32);
    expect(glyphGrid(512)).toBe(48);
  });
});
