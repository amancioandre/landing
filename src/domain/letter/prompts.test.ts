import { describe, expect, it } from "vitest";
import { interleave, shortEnough } from "./prompts";

describe("interleave", () => {
  it("brings the next ask back before every few prompts, a different one each time", () => {
    expect(interleave(["a", "b", "c", "d", "e"], ["X", "Y"], 2)).toEqual(["X", "a", "b", "Y", "c", "d", "X", "e"]);
  });

  it("keeps every prompt exactly once", () => {
    const out = interleave(["a", "b", "c"], ["X"], 3);
    expect(out.filter((p) => p !== "X")).toEqual(["a", "b", "c"]);
  });

  it("returns the prompts alone when there is nothing to ask", () => {
    expect(interleave(["a", "b"], [], 2)).toEqual(["a", "b"]);
  });
});

describe("shortEnough", () => {
  it("keeps only prompts that fit the bar without wrapping", () => {
    expect(shortEnough(["Hello!", "Tell me a story", "What keeps you up at night?"], 16)).toEqual(["Hello!", "Tell me a story"]);
  });
});

describe("shortEnough, in wide scripts", () => {
  it("counts a Chinese, Japanese or Korean character as two columns, the room it takes on screen", () => {
    expect(shortEnough(["今日は外に出ましたか？", "物語を聞かせて"], 16)).toEqual(["物語を聞かせて"]);
  });

  it("counts Cyrillic letters as one column, like Latin ones", () => {
    expect(shortEnough(["Расскажи мне историю"], 20)).toEqual(["Расскажи мне историю"]);
  });
});
