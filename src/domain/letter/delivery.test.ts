import { describe, expect, it } from "vitest";
import { envelope, MAX_NOTE, readMessage } from "./delivery";

describe("a letter arriving at the Worker", () => {
  it("is read with the same rules the page uses, prompt kept", () => {
    expect(readMessage({ prompt: "Hello!", note: "  Hi André ", from: " me@example.com " }))
      .toEqual({ ok: true, message: { prompt: "Hello!", note: "Hi André", from: "me@example.com" } });
  });

  it("needs words and a reply address that looks right", () => {
    expect(readMessage({ note: "   ", from: "me@example.com" })).toEqual({ ok: false, problem: "not-ready" });
    expect(readMessage({ note: "Hi", from: "me@" })).toEqual({ ok: false, problem: "bad-email" });
  });

  it("turns away anything that isn't a letter", () => {
    expect(readMessage(null)).toEqual({ ok: false, problem: "malformed" });
    expect(readMessage({ note: 3, from: "me@example.com" })).toEqual({ ok: false, problem: "malformed" });
    expect(readMessage({ note: "Hi", from: "me@example.com", prompt: 7 })).toEqual({ ok: false, problem: "malformed" });
  });

  it("turns away a letter too long to be one", () => {
    expect(readMessage({ note: "a".repeat(MAX_NOTE + 1), from: "me@example.com" })).toEqual({ ok: false, problem: "too-long" });
  });
});

describe("the letter in Andre's inbox", () => {
  it("answers the writer when he replies, and puts the question it answers on top", () => {
    const mail = envelope({ prompt: "What would you ask the hunter?", note: "Where do you hunt?", from: "me@example.com" });
    expect(mail.replyTo).toBe("me@example.com");
    expect(mail.subject).toContain("me@example.com");
    expect(mail.text.indexOf("What would you ask the hunter?")).toBeLessThan(mail.text.indexOf("Where do you hunt?"));
  });

  it("is just the words when no question was showing", () => {
    expect(envelope({ note: "Hello", from: "me@example.com" }).text).toBe("Hello\n");
  });
});
