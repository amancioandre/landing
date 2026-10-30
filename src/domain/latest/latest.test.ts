import { describe, expect, it } from "vitest";
import { excerpt, latest, rssFeed, type Entry } from "./latest";

const entry = (title: string, date: string, via: Entry["via"] = "substack"): Entry =>
  ({ title, date, url: `https://example.com/${title}`, via });

describe("latest", () => {
  it("puts the newest first, from every source", () => {
    const out = latest([entry("old", "2026-01-01"), entry("film", "2026-10-01", "youtube"), entry("mid", "2026-05-01")], 10);
    expect(out.map((e) => e.title)).toEqual(["film", "mid", "old"]);
  });

  it("keeps only as many as the page shows", () => {
    expect(latest([entry("a", "2026-01-01"), entry("b", "2026-02-01"), entry("c", "2026-03-01")], 2)).toHaveLength(2);
  });

  it("drops the same post twice", () => {
    expect(latest([entry("a", "2026-01-01"), entry("a", "2026-01-01")], 10)).toHaveLength(1);
  });

  it("drops entries without a title or a date", () => {
    expect(latest([entry("", "2026-01-01"), entry("x", "not a date")], 10)).toEqual([]);
  });
});

describe("excerpt", () => {
  it("keeps short text whole", () => {
    expect(excerpt("Later that day.", 100)).toBe("Later that day.");
  });

  it("cuts long text at a word and marks the cut", () => {
    expect(excerpt("Later that day Gever and Lee decided to explore", 20)).toBe("Later that day Gever…");
  });

  it("strips markup and squeezes whitespace", () => {
    expect(excerpt("<p>Later  that\n day</p>", 100)).toBe("Later that day");
  });
});

describe("the hub's own feed (ADR 0009: RSS mirrors Latest)", () => {
  const xml = rssFeed([{ ...entry("The Way Back & home", "2026-09-10"), excerpt: "Later <that> day" }], {
    title: "André Amnc", site: "https://andreamnc.com", description: "Everything André publishes, wherever it lives",
  });

  it("is RSS 2.0 with the site as its channel", () => {
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0"/);
    expect(xml).toContain("<link>https://andreamnc.com</link>");
  });

  it("carries each entry with its own link, date and source, escaped", () => {
    expect(xml).toContain("<title>The Way Back &amp; home</title>");
    expect(xml).toContain("<link>https://example.com/The Way Back & home</link>".replace("&", "&amp;"));
    expect(xml).toContain("<pubDate>Thu, 10 Sep 2026 00:00:00 GMT</pubDate>");
    expect(xml).toContain("<category>substack</category>");
    expect(xml).toContain("<description>Later &lt;that&gt; day</description>");
  });
});
