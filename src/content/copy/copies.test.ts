import { describe, expect, it } from "vitest";
import { COPIES, copyIn } from "./index";
import { EN } from "./en";
import { LANGUAGES } from "../../domain/languages/languages";

const blanks = (line: string) => (line.match(/\{\w+\}/g) ?? []).sort();

describe("every language has the whole page", () => {
  it("has words for every language the hub lists", () => {
    for (const language of LANGUAGES) expect(() => copyIn(language)).not.toThrow();
  });

  it.each(Object.entries(COPIES))("%s asks all of Andre's questions, no more, no fewer", (_, copy) => {
    expect(copy.prompts).toHaveLength(EN.prompts.length);
  });

  it.each(Object.entries(COPIES))("%s keeps every blank the English fills in", (_, copy) => {
    expect(blanks(copy.letter.failed)).toEqual(["{address}"]);
    expect(blanks(copy.carousel.slide)).toEqual(blanks("{n}{total}{name}"));
    expect(blanks(copy.carousel.show)).toEqual(["{name}"]);
    expect(blanks(copy.now.slide)).toEqual(blanks("{n}{total}{kind}"));
    expect(blanks(copy.now.open.story)).toEqual(["{where}"]);
    expect(blanks(copy.now.open.post)).toEqual(["{where}"]);
  });

  it.each(Object.entries(COPIES))("%s translates every link label English translates", (_, copy) => {
    expect(Object.keys(copy.links).sort()).toEqual(Object.keys(EN.links).sort());
  });
});
