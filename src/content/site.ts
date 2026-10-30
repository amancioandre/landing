// Who the site is about and how it describes itself: Andre's words (.docs/copy/interest-lines.md) and the facts he gave.
export const SITE = {
  url: "https://andreamnc.com/",
  name: "André Amnc",
  alternateName: "André Amâncio de Moraes",   // Andre, 2026-10-29 (from his Google snippet)
  jobTitle: "Systems Engineer & AI Specialist", // Andre, 2026-10-29 (from his Google snippet)
  // The first two sentences: the description search engines and link previews show.
  summary: "André Amnc's hub. My way of presenting myself to the world, creatively and playfully: my interests, what I can do for you, and what I give back to nature and society.",
  // The rest of his paragraph, which completes it on the page.
  more: "I hope you experience my interests as I do, through the links and content I bring to you: software engineering and the code I am working on (or playing with!), an outdoorsman's videos and articles, the novels and short stories I am creating, hunting adventures throughout British Columbia, and the hardships of entrepreneurship in the age of AI.",
  // What he knows about, named the way the interests are on the page.
  knowsAbout: ["Software engineering", "The outdoors", "Writing", "Storytelling", "Hunting", "Entrepreneurship", "AI adoption"],
  image: "https://andreamnc.com/og.png",
} as const;
