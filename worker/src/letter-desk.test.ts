import { describe, expect, it } from "vitest";
import { receiveLetter, type Desk } from "./letter-desk";
import type { Envelope } from "../../src/domain/letter/delivery";

const letter = { prompt: "Hello!", note: "Hi André", from: "me@example.com", token: "pass", visit: { via: "bar", interest: "Writer", junk: "x" } };
const post = (body: unknown, method = "POST") =>
  new Request("https://andreamnc.com/letter", { method, headers: { "content-type": "application/json", "cf-connecting-ip": "1.2.3.4" }, body: method === "POST" ? JSON.stringify(body) : undefined });
const desk = (over: Partial<Desk> = {}) => {
  const delivered: Envelope[] = [], checked: string[][] = [];
  const port: Desk = {
    isHuman: async (token, ip) => (checked.push([token, ip]), token === "pass"),
    deliver: async (mail) => { delivered.push(mail); },
    ...over,
  };
  return { port, delivered, checked };
};

describe("Given a letter written on andreamnc.com", () => {
  it("When a person sends it, Then it reaches Andre's inbox and the page hears it was sent", async () => {
    const { port, delivered, checked } = desk();
    const res = await receiveLetter(post(letter), port);
    expect(res.status).toBe(200);
    expect(checked).toEqual([["pass", "1.2.3.4"]]);
    expect(delivered).toHaveLength(1);
    expect(delivered[0].replyTo).toBe("me@example.com");
  });

  it("When it arrives, Then Andre also reads where it was written, what they looked at, and where they are", async () => {
    const { port, delivered } = desk();
    await receiveLetter(post(letter), port, { city: "Calgary", country: "CA" });
    expect(delivered[0].text).toContain("Written in the bar at the top");
    expect(delivered[0].text).toContain("Looking at Writer");
    expect(delivered[0].text).toContain("Calgary, CA");
    expect(delivered[0].text).not.toContain("junk");
  });

  it("When a bot sends it, Then nothing is delivered", async () => {
    const { port, delivered } = desk();
    expect((await receiveLetter(post({ ...letter, token: "bot" }), port)).status).toBe(403);
    expect((await receiveLetter(post({ ...letter, token: undefined }), port)).status).toBe(403);
    expect(delivered).toHaveLength(0);
  });

  it("When it isn't a letter, Then it is turned away before anything is checked", async () => {
    const { port, delivered, checked } = desk();
    expect((await receiveLetter(post({ ...letter, from: "me@" }), port)).status).toBe(422);
    expect((await receiveLetter(new Request("https://andreamnc.com/letter", { method: "POST", body: "{nope" }), port)).status).toBe(400);
    expect((await receiveLetter(post(null, "GET"), port)).status).toBe(405);
    expect(delivered).toHaveLength(0);
    expect(checked).toHaveLength(0);
  });

  it("When the mail can't go out, Then the page hears it didn't go through", async () => {
    const { port } = desk({ deliver: async () => { throw new Error("routing down"); } });
    expect((await receiveLetter(post(letter), port)).status).toBe(502);
  });
});
