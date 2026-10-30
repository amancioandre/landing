import { describe, expect, it } from "vitest";
import { lock, release, startTyping, tick, visible, type Typing } from "./typewriter";

const PROMPTS = ["Hi!", "Tell me"];
const run = (state: Typing, ticks: number) => Array.from({ length: ticks }).reduce<Typing>((s) => tick(s, PROMPTS, { hold: 2 }), state);

describe("the typewriter in the bar", () => {
  it("types the prompt one letter per tick", () => {
    expect(visible(run(startTyping(), 2), PROMPTS)).toBe("Hi");
    expect(visible(run(startTyping(), 3), PROMPTS)).toBe("Hi!");
  });

  it("holds the whole prompt, then erases it and types the next", () => {
    const typed = run(startTyping(), 3);           // "Hi!"
    const held = run(typed, 3);                     // hold 2 ticks, then start erasing
    expect(visible(run(typed, 2), PROMPTS)).toBe("Hi!");
    expect(visible(held, PROMPTS).length).toBeLessThan(3);
    const next = run(held, 4);
    expect(next.at).toBe(1);
  });

  it("wraps around to the first prompt after the last", () => {
    expect(tick({ at: 1, n: 0, phase: "erase", wait: 0, locked: false }, PROMPTS, { hold: 2 }).at).toBe(0);
  });

  it("stops on a locked prompt, showing it whole", () => {
    const locked = lock(run(startTyping(), 1), PROMPTS);
    expect(visible(locked, PROMPTS)).toBe("Hi!");
    expect(run(locked, 20)).toEqual(locked);
  });

  it("lets go of a prompt and moves on", () => {
    const released = release(lock(startTyping(), PROMPTS));
    expect(released.locked).toBe(false);
    expect(released.phase).toBe("erase");
  });
});

describe("starting the typewriter", () => {
  it("can open with its first prompt already whole, holding", () => {
    const opened = startTyping(PROMPTS, { whole: true });
    expect(visible(opened, PROMPTS)).toBe("Hi!");
    expect(opened.phase).toBe("hold");
  });
});
