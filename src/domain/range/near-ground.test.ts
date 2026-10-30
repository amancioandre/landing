import { describe, expect, it } from "vitest";
import { crestDepth, nearGroundMask, nearGroundRise, smoothAcross } from "./near-ground";

const W = 40, H = 100, INK = 40, PAPER = 240;
// A picture as rows of tone, painted from the bottom up: [rows, tone] pairs.
function picture(fromBottom: Array<[number, number]>, width = W): Uint8Array {
  const gray = new Uint8Array(width * H).fill(PAPER);
  let y = H;
  for (const [rows, tone] of fromBottom) for (let r = 0; r < rows; r++) gray.fill(tone, --y * width, y * width + width);
  return gray;
}

describe("near ground rises from the bottom while the ink stays connected (ADR 0006)", () => {
  it("is nothing on blank paper", () => {
    expect(nearGroundRise(picture([]), W, H).every((r) => r === 0)).toBe(true);
  });

  it("is the height of the dark ground at the foot", () => {
    expect(nearGroundRise(picture([[10, INK]]), W, H)[20]).toBe(10);
  });

  it("does not count ink floating above a band of mist", () => {
    expect(nearGroundRise(picture([[10, INK], [10, PAPER], [5, INK]]), W, H)[20]).toBe(10);
  });

  it("carries on through a short light gap, such as between trees", () => {
    expect(nearGroundRise(picture([[10, INK], [4, PAPER], [5, INK]]), W, H)[20]).toBe(19);
  });

  it("never drops more than 3 rows from one column to the next", () => {
    const gray = picture([[2, INK]]);
    for (let y = H - 30; y < H; y++) gray[y * W + 20] = INK;   // one tall column
    const rise = nearGroundRise(gray, W, H);
    for (let x = 1; x < W; x++) expect(Math.abs(rise[x] - rise[x - 1])).toBeLessThanOrEqual(3);
  });
});

describe("the near-ground mask", () => {
  it("is full below the edge and empty above it, with a short seam between", () => {
    const rise = new Array(W).fill(20);
    const mask = nearGroundMask(rise, W, H);
    expect(mask[(H - 1) * W]).toBe(255);
    expect(mask[(H - 40) * W]).toBe(0);
    const seam = mask[(H - 22) * W];
    expect(seam).toBeGreaterThan(0);
    expect(seam).toBeLessThan(255);
  });
});

describe("crest depth, the valley's near map", () => {
  it("is zero where no ridge crosses the column", () => {
    expect(crestDepth(picture([]), W, H).every((d) => d === 0)).toBe(true);
  });

  it("is deepest for a crest low in the picture", () => {
    const depth = crestDepth(picture([[5, INK]]), W, H);
    expect(depth[(H - 1) * W + 5]).toBeGreaterThan(240);
  });

  it("averages sideways so a ridge sits at one distance along its length", () => {
    const row = new Uint8Array([0, 0, 255, 0, 0]);
    expect(Array.from(smoothAcross(row, 5, 1, 1))).toEqual([0, 85, 85, 85, 0]);
  });
});
