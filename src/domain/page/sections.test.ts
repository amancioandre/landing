import { describe, expect, it } from "vitest";
import { sectionsOf } from "./sections";

describe("the page's sections (Andre, 2026-10-31: the Now replaces the Interests section)", () => {
  it("are Latest, the Now and write to me once Andre has tagged something", () => {
    expect(sectionsOf({ showsNow: true })).toEqual([
      { id: "latest", number: "01" }, { id: "now", number: "02" }, { id: "write", number: "03" }]);
  });

  it("leave the Now out while nothing is tagged, the range and its index carrying the interests", () => {
    expect(sectionsOf({ showsNow: false })).toEqual([{ id: "latest", number: "01" }, { id: "write", number: "02" }]);
  });
});
