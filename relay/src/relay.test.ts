import { describe, expect, it } from "vitest";
import { relay } from "./relay";

const FEED = "https://andramnc.substack.com/feed";
const asked: string[] = [];
const substack = async (url: string) => { asked.push(url); return new Response("<rss/>", { headers: { "content-type": "application/xml; charset=utf-8" } }); };
const at = (path: string, method = "GET") => new Request(`https://andreamnc.com${path}`, { method });

describe("the feed relay (ADR 0030): Substack turns GitHub's servers away, so the collector reads it through andreamnc.com", () => {
  it("hands on Andre's Substack feed as Substack gave it", async () => {
    const res = await relay(at("/feeds/substack"), substack);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("<rss/>");
    expect(res.headers.get("content-type")).toMatch(/xml/);
    expect(asked.at(-1)).toBe(FEED);
  });

  it("relays only that feed, never another address: it is not an open proxy", async () => {
    expect((await relay(at("/feeds/elsewhere"), substack)).status).toBe(404);
    expect((await relay(at("/feeds/substack?url=https://example.com"), substack)).url).not.toBe("https://example.com");
    expect(asked.every((u) => u === FEED)).toBe(true);
  });

  it("only reads", async () => {
    expect((await relay(at("/feeds/substack", "POST"), substack)).status).toBe(405);
  });

  it("says so when Substack turns the relay away too", async () => {
    const res = await relay(at("/feeds/substack"), async () => new Response("no", { status: 403 }));
    expect(res.status).toBe(502);
  });
});
