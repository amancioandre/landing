import { XMLParser } from "fast-xml-parser";
import { excerpt, type Entry } from "../../domain/latest/latest";
import { TAG } from "../now/parse";

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
    picture: text(entry["media:group"]?.["media:thumbnail"]?.["@url"]) || undefined,
  }));
}

/** The feed names a small, letterboxed cover; YouTube keeps the full 16:9 one beside it (not for every video). */
export const fullSize = (picture: string): string => picture.replace(/\/hqdefault\.jpg$/, "/maxresdefault.jpg");

interface Repo { name: string; description: string | null; html_url: string; created_at: string; fork: boolean; private: boolean; topics?: string[] }

/** GitHub's REST list of repos: only Andre's originals he tagged `andreamnc`, each dated when he made it. */
export function parseRepos(json: string): Entry[] {
  return (JSON.parse(json || "[]") as Repo[])
    .filter((r) => !r.fork && !r.private && (r.topics ?? []).includes(TAG))
    .map((r) => ({
      title: r.name, url: r.html_url, date: iso(r.created_at), via: "github" as const,
      ...(r.description ? { excerpt: excerpt(r.description, EXCERPT) } : {}),
    }));
}
