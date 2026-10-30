import type { APIRoute } from "astro";
import { rssFeed } from "../domain/latest/latest";
import { loadLatest } from "../adapters/feeds/load";

// One feed for everything Andre publishes, each item pointing to where it lives (ADR 0009). Built with the page.
export const GET: APIRoute = async ({ site }) =>
  new Response(rssFeed(await loadLatest(), {
    title: "André Amnc",
    site: String(site ?? "https://andreamnc.com"),
    // Claude's line at Andre's request ("RSS description you come up with one"), from the topics in his paragraph.
    description: "What André Amnc publishes, wherever it lives: software, the outdoors, stories, hunting in British Columbia, and entrepreneurship in the age of AI.",
  }), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
