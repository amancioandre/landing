import { EN } from "./copy/en";

// Who the site is about and how it describes itself: Andre's words (.docs/copy/interest-lines.md) and the facts he gave.
export const SITE = {
  url: "https://andreamnc.com/",
  name: "André Amnc",
  alternateName: "André Amâncio de Moraes",   // Andre, 2026-10-29 (from his Google snippet)
  jobTitle: "Systems Engineer & AI Specialist", // Andre, 2026-10-29 (from his Google snippet)
  // The first two sentences: the description search engines and link previews show.
  summary: EN.site.summary,
  // The rest of his paragraph, which completes it on the page.
  more: EN.site.more,
  // What he knows about, named the way the interests are on the page.
  knowsAbout: ["Software engineering", "The outdoors", "Writing", "Storytelling", "Hunting", "Entrepreneurship", "AI adoption"],
  image: "https://andreamnc.com/og.png",
} as const;
