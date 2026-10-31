import { excerpt } from "../../domain/latest/latest";
import type { Item } from "../../domain/now/now";

// The three places Andre tags things for the Now (ADR 0027), read as plain data. Only tagged items leave here.
export const TAG = "andreamnc";
const NESTED = `${TAG}/now`;
const WORDS = 220;   // characters of a note's or post's own opening, cut at a word

// Public.md: nothing from these folders reaches a public surface unless Andre asks for that piece.
const PRIVATE = new Set(["journal", "people", "body", "telos", "notes", "storytelling"]);
export const mayRead = (path: string) => !path.split("/").some((part) => PRIVATE.has(part));

type Front = Record<string, string | string[]>;

function split(text: string): { front: Front; body: string } {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { front: {}, body: text };
  const front: Front = {};
  let list: string | undefined;
  for (const line of m[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && list) { (front[list] as string[]).push(unquote(item[1])); continue; }
    const pair = line.match(/^([\w-]+):\s*(.*)$/);
    if (!pair) continue;
    const [, key, value] = pair;
    list = undefined;
    if (value === "") { front[key] = []; list = key; }
    else if (value.startsWith("[")) front[key] = value.replace(/^\[|\]$/g, "").split(",").map(unquote).filter(Boolean);
    else front[key] = unquote(value);
  }
  return { front, body: m[2] };
}

const unquote = (s: string) => s.trim().replace(/^["']|["']$/g, "");
const many = (v?: string | string[]) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const one = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
const withoutCode = (body: string) => body.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ");
const link = (s?: string) => (s && /^https?:\/\//.test(s) ? s : undefined);

const tagged = (front: Front, body: string) =>
  many(front.site).includes(TAG) ||
  many(front.tags).some((t) => t.replace(/^#/, "") === NESTED) ||
  new RegExp(`(^|\\s)#${NESTED}(?![\\w/-])`).test(withoutCode(body));

/** The opening paragraph as plain text: Obsidian's links and Markdown's marks fall away, the words stay as written. */
function opening(body: string): string | undefined {
  const paragraph = withoutCode(body).split(/\r?\n\s*\r?\n/).map((p) => p.trim())
    .find((p) => p && !p.startsWith("#") && !p.startsWith(">") && !/^[-*]\s/.test(p) && p.replace(/#[\w/-]+/g, "").trim());
  if (!paragraph) return undefined;
  const plain = paragraph
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_|~~|==)(.+?)\1/g, "$2")
    .replace(/(^|\s)#[\w/-]+/g, "$1");
  return excerpt(plain, WORDS) || undefined;
}

const fileName = (path: string) => path.split("/").pop()!.replace(/\.md$/, "");
const heading = (body: string) => body.match(/^#\s+(.+)$/m)?.[1].trim();

/** One vault note, or null when Andre didn't tag it. `changed` is the file's last change, for notes with no date. */
export function fromNote(path: string, text: string, changed: string): Item | null {
  const { front, body } = split(text);
  if (!tagged(front, body)) return null;
  const words = opening(body);
  return {
    kind: one(front.kind) === "story" ? "story" : "note",
    title: one(front.title) ?? heading(body) ?? fileName(path),
    ...(words && { words }),
    date: one(front.date) ?? one(front.updated) ?? changed,
    ...(link(one(front.url)) && { url: link(one(front.url)) }),
    via: "obsidian",
    where: "Obsidian",
  };
}

export interface Repo { name: string; description: string | null; url: string; pushedAt: string; isPrivate: boolean; owner: { login: string } }

/** Repos carrying the topic, from `gh search repos --topic`. A private repo never shows, whatever its topics. */
export const fromRepos = (repos: readonly Repo[]): Item[] =>
  repos.filter((r) => !r.isPrivate).map((r) => ({
    kind: "code", title: r.name, ...(r.description && { words: r.description }),
    date: r.pushedAt, url: r.url, via: "github", where: r.owner.login,
  }));

export interface BufferPost { status: string; sentAt: string | null; channelService: string; externalLink: string | null; text: string; tags: readonly { name: string }[] }

const CHANNELS: Record<string, string> = { instagram: "Instagram", linkedin: "LinkedIn", youtube: "YouTube", facebook: "Facebook", threads: "Threads", twitter: "X", tiktok: "TikTok", bluesky: "Bluesky", mastodon: "Mastodon", pinterest: "Pinterest", googlebusiness: "Google" };

/** Sent posts carrying Buffer's own tag, which followers never see. */
export const fromBuffer = (posts: readonly BufferPost[]): Item[] =>
  posts.filter((p) => p.status === "sent" && p.sentAt && p.tags.some((t) => t.name.toLowerCase() === TAG)).map((p) => {
    const words = excerpt(p.text, WORDS);
    return {
      kind: "post", ...(words && { words }), date: p.sentAt!, ...(p.externalLink && { url: p.externalLink }),
      via: p.channelService, where: CHANNELS[p.channelService] ?? p.channelService,
    };
  });
