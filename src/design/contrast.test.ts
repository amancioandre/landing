import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

describe("contrastRatio", () => {
  it("is 21 between black and white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("is 1 between a colour and itself", () => {
    expect(contrastRatio("#d01509", "#d01509")).toBeCloseTo(1, 5);
  });

  it("does not depend on which colour is the text", () => {
    expect(contrastRatio("#eeebe5", "#0c0c0b")).toBeCloseTo(contrastRatio("#0c0c0b", "#eeebe5"), 10);
  });
});
