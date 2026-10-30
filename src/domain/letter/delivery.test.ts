import { describe, expect, it } from "vitest";
import { envelope, MAX_NOTE, readMessage, readVisit } from "./delivery";

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
  const hunter = { prompt: "What would you ask the hunter?", note: "Where do you hunt?", from: "me@example.com" };

  it("answers the writer when he replies, and puts the question it answers on top", () => {
    const mail = envelope(hunter);
    expect(mail.replyTo).toBe("me@example.com");
    expect(mail.text.indexOf("What would you ask the hunter?")).toBeLessThan(mail.text.indexOf("Where do you hunt?"));
  });

  it("is titled by its question, or by its first words when there was none", () => {
    expect(envelope(hunter).subject).toBe("What would you ask the hunter?");
    expect(envelope({ note: "Hello André, I watched your film about the elk hunt in the Kootenays last night", from: "me@example.com" }).subject)
      .toBe("Hello André, I watched your film about the elk…");
    expect(envelope({ note: "Hi", from: "me@example.com" }).subject).toBe("Hi");
  });

  it("is just the words when nothing more is known", () => {
    expect(envelope({ note: "Hello", from: "me@example.com" }).text).toBe("Hello\n");
  });

  it("tells Andre, under the letter, where it was written, how they came, what they looked at, where and when they are", () => {
    const visit = { via: "section", from: "https://www.youtube.com/watch?v=x", campaign: "youtube / video", interest: "Hunter", device: "phone", sky: "night" } as const;
    const place = { city: "Calgary", region: "Alberta", country: "CA", timeZone: "America/Edmonton" };
    const text = envelope(hunter, visit, place, new Date("2026-10-30T03:40:00Z")).text;
    expect(text.indexOf("Where do you hunt?")).toBeLessThan(text.indexOf("—"));
    expect(text).toContain("Written in the write to me section");
    expect(text).toContain("Came from www.youtube.com (youtube / video)");
    expect(text).toContain("Looking at Hunter");
    expect(text).toContain("Calgary, Alberta, CA, Thu 9:40 PM their time");
    expect(text).toContain("On a phone, at night");
  });
});

describe("what the page says about the visit", () => {
  it("keeps only what it knows how to read", () => {
    expect(readVisit({ via: "bar", device: "tablet", sky: "day", interest: "Writer", extra: "x" }))
      .toEqual({ via: "bar", device: "tablet", sky: "day", interest: "Writer" });
    expect(readVisit({ via: "elsewhere", device: 3, sky: "dusk" })).toEqual({});
    expect(readVisit("nonsense")).toEqual({});
  });

  it("keeps the arrival short", () => {
    expect(readVisit({ from: "https://a.com/" + "x".repeat(500) }).from).toHaveLength(200);
  });
});
