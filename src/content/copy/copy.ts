import type { Kind } from "../../domain/now/now";

// Every word the page shows, in one shape. English (en.ts) is Andre's original; the others translate it line by line.
// `{address}`, `{n}`, `{total}` and `{name}` are filled in where the words are used.
export type InterestName = "Engineer" | "Outdoorsman" | "Writer" | "Hunter" | "Entrepreneur";

export interface InterestWords {
  label: string;
  line: string;   // Andre's line on the interest
  alt: string;    // the photograph, described
}

export interface Copy {
  site: { summary: string; more: string; imageAlt: string };
  sections: { latest: string; interests: string; now: string; write: string; nav: string; menu: string };
  interests: Record<InterestName, InterestWords>;
  links: Record<string, string>;   // link labels that need translating, keyed by the English; proper names stay as they are
  range: { label: string; index: string; photoToCome: string; lineToCome: string };
  carousel: { all: string; previous: string; next: string; strip: string; slide: string; show: string; carouselRole: string; slideRole: string };
  latest: { nothingYet: string };
  now: {   // the carousel of what Andre tagged (ADR 0027); `{where}` is the place the thing lives
    kinds: Record<Kind, string>;
    previous: string; next: string; strip: string; slide: string;
    open: Record<Kind, string>;
  };
  letter: {
    opening: string;       // the bar types it first
    message: string; email: string; emailPlaceholder: string; enter: string;
    edit: string; another: string; orWriteTo: string;
    badEmail: string; failed: string; sent: string;
  };
  prompts: readonly string[];               // Andre's questions, in his order
  asks: Record<InterestName, string>;       // "What would you ask the …?", one per interest
  offer: string;   // in this language, offering this language to a reader whose browser prefers it
  footer: { channels: string; languages: string };
}
