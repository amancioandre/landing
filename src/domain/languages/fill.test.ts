import { describe, expect, it } from "vitest";
import { fill } from "./fill";

describe("filling a translated line", () => {
  it("puts each value where the line asks for it, wherever the language puts it", () => {
    expect(fill("{n} / {total}: {name}", { n: 2, total: 5, name: "Hunter" })).toBe("2 / 5: Hunter");
    expect(fill("{total}件中{n}件目", { n: 2, total: 5 })).toBe("5件中2件目");
  });

  it("leaves a line without blanks as it is", () => {
    expect(fill("Sent. Thank you.", { address: "hello@andreamnc.com" })).toBe("Sent. Thank you.");
  });
});
