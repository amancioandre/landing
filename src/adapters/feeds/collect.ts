import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { refresh, SOURCES, type Entry, type Snapshot, type Source } from "../../domain/latest/latest";
import { FEEDS, GITHUB_USER, LATEST_FILE, SUBSTACK_RELAY } from "../../content/feeds";
import { fullSize, parseRepos, parseSubstack, parseYouTube } from "./parse";

// The collector (ADR 0030): reads every place Andre publishes and refreshes the saved copy of Latest. A source that
// can't be read keeps its last entries. It runs on a schedule; the page itself never reads the network.
const TRIES = 4;
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function get(url: string, headers: Record<string, string> = {}): Promise<string> {
  let last: unknown;
  for (let i = 0; i < TRIES; i++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(15_000) });
      if (res.ok) return await res.text();
      last = new Error(`HTTP ${res.status}`);
      if (res.status < 500 && res.status !== 404 && res.status !== 429) break;   // YouTube's feed answers 404 when it stumbles
    } catch (error) { last = error; }
    await pause(2_000 * 2 ** i);
  }
  throw last;
}

// The full-size cover where YouTube has one; otherwise the feed's own.
async function sharpest(entry: Entry): Promise<Entry> {
  if (!entry.picture) return entry;
  const full = fullSize(entry.picture);
  if (full === entry.picture) return entry;
  const res = await fetch(full, { method: "HEAD", signal: AbortSignal.timeout(10_000) }).catch(() => undefined);
  return res?.ok ? { ...entry, picture: full } : entry;
}

async function repos(): Promise<Entry[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "andreamnc.com" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const api = (path: string) => get(`https://api.github.com/${path}`, headers);
  const orgs = (JSON.parse(await api(`users/${GITHUB_USER}/orgs`)) as { login: string }[]).map((o) => o.login);
  const lists = await Promise.all([
    api(`users/${GITHUB_USER}/repos?type=owner&per_page=100`),
    ...orgs.map((o) => api(`orgs/${o}/repos?type=public&per_page=100`)),
  ]);
  return lists.flatMap(parseRepos);
}

const READERS: Record<Source, () => Promise<Entry[]>> = {
  // Through the relay first (Substack turns GitHub's servers away), then straight from Substack.
  substack: async () => parseSubstack(await get(SUBSTACK_RELAY).catch(() => get(FEEDS.substack))),
  youtube: async () => Promise.all(parseYouTube(await get(FEEDS.youtube)).map(sharpest)),
  github: repos,
};

export interface Collected { snapshot: Snapshot; changed: boolean; failed: string[] }

/** Reads `only` the named sources (all by default), refreshes the saved copy, and writes it when it changed. */
export async function collectLatest(root = process.cwd(), only: readonly Source[] = SOURCES): Promise<Collected> {
  const file = join(root, LATEST_FILE);
  const before = await readFile(file, "utf8").catch(() => "");
  const previous = (before ? JSON.parse(before) : {}) as Snapshot;
  const settled = await Promise.allSettled(only.map((s) => READERS[s]()));
  const read: Partial<Snapshot> = {}, failed: string[] = [];
  settled.forEach((r, i) => (r.status === "fulfilled" ? (read[only[i]] = r.value) : failed.push(`${only[i]}: ${String(r.reason)}`)));
  const snapshot = refresh(previous, read);
  const text = JSON.stringify(snapshot, null, 2) + "\n";
  if (text !== before) await writeFile(file, text);
  return { snapshot, changed: text !== before, failed };
}
