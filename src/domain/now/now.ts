// Now: what Andre tagged `andreamnc` himself, wherever it lives (ADR 0027). The hub shows it; it never chooses it.
// Each kind keeps its own shape on the page: a note, a story, a post, code.
export type Kind = "note" | "story" | "post" | "code";

export interface Item {
  readonly kind: Kind;
  readonly title?: string;    // a note's or story's title, a repo's name; posts often have none
  readonly words?: string;    // its own opening words, cut, never rewritten
  readonly date: string;      // ISO 8601
  readonly url?: string;      // where it lives; a vault note has none unless Andre gives one
  readonly via: string;       // the source: obsidian, github, instagram…
  readonly where: string;     // as the card names it: "Obsidian", the repo's owner, the channel
}

const said = (s?: string) => (s ?? "").trim().length > 0;
const valid = (i: Item) => (said(i.title) || said(i.words)) && !Number.isNaN(Date.parse(i.date));
const identity = (i: Item) => i.url ?? `${i.via}:${i.title ?? i.words}`;

export function now(items: readonly Item[], count: number): Item[] {
  const seen = new Set<string>();
  return items
    .filter(valid)
    .filter((i) => !seen.has(identity(i)) && seen.add(identity(i)))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, count);
}

/** The old Interests carousel holds section 02 until Andre has tagged something. */
export const showsNow = (items: readonly Item[]) => items.length > 0;
