import { describe, expect, it } from "vitest";
import { icoFrom } from "./ico";

const png = (bytes: number) => new Uint8Array(bytes).fill(7);

describe("one .ico holding the small drawings, for browsers that ask for /favicon.ico", () => {
  const ico = icoFrom([{ size: 16, png: png(10) }, { size: 32, png: png(20) }, { size: 256, png: png(5) }]);
  const view = new DataView(ico.buffer);

  it("says it is an icon with three pictures", () => {
    expect([view.getUint16(0, true), view.getUint16(2, true), view.getUint16(4, true)]).toEqual([0, 1, 3]);
  });

  it("names each picture's size, 256 written as 0", () => {
    expect([ico[6], ico[22], ico[38]]).toEqual([16, 32, 0]);
  });

  it("points each entry at its own PNG, one after the other", () => {
    const first = 6 + 16 * 3;
    expect([view.getUint32(6 + 8, true), view.getUint32(6 + 12, true)]).toEqual([10, first]);
    expect(view.getUint32(22 + 12, true)).toBe(first + 10);
    expect(ico.length).toBe(first + 35);
  });
});
