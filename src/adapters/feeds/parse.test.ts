import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { fullSize, parseRepos, parseSubstack, parseYouTube } from "./parse";

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");

describe("reading Andre's feeds", () => {
  it("reads the Substack RSS: title, date, link and his opening words", () => {
    const [first] = parseSubstack(fixture("substack.xml"));
    expect(first).toMatchObject({ title: "The Way Back", url: "https://andramnc.substack.com/p/the-way-back", via: "substack" });
    expect(first.date.startsWith("2026-09-10")).toBe(true);
    expect(first.excerpt).toMatch(/^Later that day Gever and Lee/);
  });

  it("reads the YouTube Atom feed", () => {
    expect(parseYouTube(fixture("youtube.xml"))).toEqual([{
      title: "A film title", url: "https://www.youtube.com/watch?v=abc123", via: "youtube",
      date: "2026-10-20T15:00:00.000Z", excerpt: "What the film is about, in its own words.",
      picture: "https://i2.ytimg.com/vi/abc123/hqdefault.jpg",
    }]);
  });

  it("knows where YouTube keeps the full-size picture of a video's cover", () => {
    expect(fullSize("https://i2.ytimg.com/vi/abc123/hqdefault.jpg")).toBe("https://i2.ytimg.com/vi/abc123/maxresdefault.jpg");
    expect(fullSize("https://example.com/cover.jpg")).toBe("https://example.com/cover.jpg");
  });

  it("reads an empty channel as no entries", () => {
    expect(parseYouTube('<feed xmlns="http://www.w3.org/2005/Atom"><title>André Amnc</title></feed>')).toEqual([]);
  });

  it("reads Andre's GitHub as his own public repos tagged andreamnc, dated when each was made; never forks", () => {
    expect(parseRepos(fixture("github.json"))).toEqual([{
      title: "creative-thesaurus", url: "https://github.com/amancioandre/creative-thesaurus", via: "github",
      date: "2026-08-29T10:00:00.000Z", excerpt: "A thesaurus for Obsidian, on your own machine.",
    }]);
  });
});
