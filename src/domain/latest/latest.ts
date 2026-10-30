// Latest: what Andre published, wherever it lives. The hub links out; it never hosts the post (ADR 0009).
export type Source = "substack" | "youtube";

export interface Entry {
  readonly title: string;
  readonly date: string;      // ISO 8601
  readonly url: string;
  readonly via: Source;
  readonly excerpt?: string;  // the post's own opening words
}

const valid = (e: Entry) => e.title.trim().length > 0 && !Number.isNaN(Date.parse(e.date));

export function latest(entries: readonly Entry[], count: number): Entry[] {
  const seen = new Set<string>();
  return entries
    .filter(valid)
    .filter((e) => !seen.has(e.url) && seen.add(e.url))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, count);
}

export function excerpt(text: string, max: number): string {
  const plain = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
}

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface Channel { title: string; site: string; description: string }

/** The hub's RSS mirrors Latest: one feed for everything, each item pointing to where it lives. */
export function rssFeed(entries: readonly Entry[], channel: Channel): string {
  const items = entries.map((e) => [
    "    <item>",
    `      <title>${escape(e.title)}</title>`,
    `      <link>${escape(e.url)}</link>`,
    `      <guid isPermaLink="true">${escape(e.url)}</guid>`,
    `      <pubDate>${new Date(e.date).toUTCString()}</pubDate>`,
    `      <category>${e.via}</category>`,
    ...(e.excerpt ? [`      <description>${escape(e.excerpt)}</description>`] : []),
    "    </item>",
  ].join("\n"));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escape(channel.title)}</title>`,
    `    <link>${escape(channel.site)}</link>`,
    `    <description>${escape(channel.description)}</description>`,
    ...items,
    "  </channel>",
    "</rss>",
  ].join("\n");
}
