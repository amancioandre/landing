import { describe, expect, it } from "vitest";
import { advance, answering, back, compose, fold, startLetter, unfold, write } from "./letter";

describe("a letter", () => {
  it("starts on the message, carrying the prompt it answers", () => {
    const letter = startLetter("Tell me a story");
    expect(letter).toEqual({ step: "say", note: "", from: "", prompt: "Tell me a story" });
  });

  it("can start without a prompt (the nav before any is locked)", () => {
    expect(startLetter().prompt).toBeUndefined();
  });

  it("moves to the email only once something is written", () => {
    expect(advance(startLetter()).step).toBe("say");
    expect(advance(write(startLetter(), "   ")).step).toBe("say");
    expect(advance(write(startLetter(), "Hello")).step).toBe("email");
  });

  it("goes back to the message without losing it", () => {
    const asking = advance(write(startLetter(), "Hello"));
    expect(back(asking)).toMatchObject({ step: "say", note: "Hello" });
  });

  it("writes into whichever field the step is on", () => {
    const asking = advance(write(startLetter(), "Hello"));
    expect(write(asking, "me@example.com")).toMatchObject({ note: "Hello", from: "me@example.com" });
  });
});

describe("folding a letter away", () => {
  it("keeps the draft, the step and the prompt", () => {
    const asking = write(advance(write(startLetter("Hello!"), "Hi")), "me@ex");
    const draft = fold(asking);
    expect(unfold(draft)).toEqual(asking);
  });

  it("keeps nothing when nothing was written", () => {
    expect(fold(startLetter("Hello!"))).toBeNull();
  });

  it("opens a fresh letter when there is no draft", () => {
    expect(unfold(null, "Tell me a story")).toEqual(startLetter("Tell me a story"));
  });
});

describe("composing the message to send", () => {
  const ready = (from: string) => write(advance(write(startLetter("Tell me a story"), "  Once  ")), from);

  it("carries the prompt, the trimmed note and the address (ADR 0017)", () => {
    expect(compose(ready("me@example.com"))).toEqual({ ok: true, message: { prompt: "Tell me a story", note: "Once", from: "me@example.com" } });
  });

  it("refuses an address that is not an email", () => {
    expect(compose(ready("me@"))).toEqual({ ok: false, problem: "bad-email" });
    expect(compose(ready(""))).toEqual({ ok: false, problem: "bad-email" });
  });

  it("refuses to send from the message step", () => {
    expect(compose(write(startLetter(), "Hi"))).toEqual({ ok: false, problem: "not-ready" });
  });

  it("leaves the prompt out when there was none", () => {
    const result = compose(write(advance(write(startLetter(), "Hi")), "me@example.com"));
    expect(result).toEqual({ ok: true, message: { note: "Hi", from: "me@example.com" } });
  });
});

describe("answering a prompt", () => {
  it("takes the prompt showing when the writer begins", () => {
    expect(answering(startLetter(), "Tell me a story").prompt).toBe("Tell me a story");
  });

  it("keeps the first prompt once words are written, even if another shows later", () => {
    const begun = write(answering(startLetter(), "Hello!"), "Hi");
    expect(answering(begun, "Tell me a story").prompt).toBe("Hello!");
  });
});
