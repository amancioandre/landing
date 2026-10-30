import { describe, expect, it } from "vitest";
import { carousel, key, next, previous, select, swipe } from "./carousel";

describe("the interests carousel", () => {
  it("starts on the card it is given", () => {
    expect(carousel(5, 1)).toEqual({ count: 5, focus: 1 });
  });

  it("moves one card at a time and stops at either end", () => {
    expect(next(carousel(5, 1)).focus).toBe(2);
    expect(next(carousel(5, 4)).focus).toBe(4);
    expect(previous(carousel(5, 0)).focus).toBe(0);
  });

  it("jumps to a chosen card, never past the ends", () => {
    expect(select(carousel(5, 1), 3).focus).toBe(3);
    expect(select(carousel(5, 1), 9).focus).toBe(4);
    expect(select(carousel(5, 1), -2).focus).toBe(0);
  });

  it("follows the arrow keys, Home and End", () => {
    const at = carousel(5, 2);
    expect(key(at, "ArrowRight")?.focus).toBe(3);
    expect(key(at, "ArrowLeft")?.focus).toBe(1);
    expect(key(at, "Home")?.focus).toBe(0);
    expect(key(at, "End")?.focus).toBe(4);
    expect(key(at, "Enter")).toBeNull();
  });

  it("turns a deliberate swipe into a move, and ignores a small drag", () => {
    const at = carousel(5, 2);
    expect(swipe(at, -80).focus).toBe(3);   // finger moves left: the next card comes in
    expect(swipe(at, 80).focus).toBe(1);
    expect(swipe(at, 12)).toEqual(at);
  });
});
