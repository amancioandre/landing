import { XMLParser } from "fast-xml-parser";
import { excerpt, type Entry } from "../../domain/latest/latest";

const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@" });
const list = <T>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const text = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");
const iso = (d: string) => new Date(d).toISOString();
const EXCERPT = 280;   // the opening words, cut at a word

/** Substack's RSS: one item per post; the description is the post's own opening. */
export function parseSubstack(feed: string): Entry[] {
  return list(xml.parse(feed)?.rss?.channel?.item).map((item: Record<string, unknown>) => ({
    title: text(item.title), url: text(item.link), date: iso(text(item.pubDate)), via: "substack" as const,
    excerpt: excerpt(text(item.description), EXCERPT),
  }));
}

/** YouTube's Atom feed: one entry per public video. */
export function parseYouTube(feed: string): Entry[] {
  return list(xml.parse(feed)?.feed?.entry).map((entry: Record<string, any>) => ({
    title: text(entry.title), url: text(list(entry.link)[0]?.["@href"]), date: iso(text(entry.published)), via: "youtube" as const,
    excerpt: excerpt(text(entry["media:group"]?.["media:description"]), EXCERPT),
  }));
}
