import type { APIRoute } from "astro";
import { SITE } from "../content/site";
import { STOPS } from "../content/interests";
import { CHANNELS, CONTACT_ADDRESS } from "../content/channels";
import { loadLatest } from "../adapters/feeds/load";

// A plain summary for AI systems (llms.txt convention): Andre's own words, his interests, where they live, how to reach him.
export const GET: APIRoute = async () => {
  const latest = await loadLatest();
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.summary}`,
    "",
    SITE.more,
    "",
    `${SITE.name} (${SITE.alternateName}), ${SITE.jobTitle}.`,
    "",
    "## Interests",
    "",
    ...STOPS.map((s) => `- ${s.label}: ${s.line ?? ""} ${s.links.map((l) => `[${l.label}](${l.url})`).join(", ")}`.trim()),
    "",
    "## Latest",
    "",
    ...(latest.length ? latest.map((e) => `- [${e.title}](${e.url}) (${e.date.slice(0, 10)})`) : ["- Nothing published yet."]),
    "",
    "## Elsewhere",
    "",
    ...CHANNELS.map((c) => `- [${c.name}](${c.url})`),
    "",
    "## Contact",
    "",
    `- Email: ${CONTACT_ADDRESS}`,
    `- Feed: ${SITE.url}rss.xml`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
