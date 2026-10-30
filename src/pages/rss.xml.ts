import type { APIRoute } from "astro";
import { rssFeed } from "../domain/latest/latest";
import { loadLatest } from "../adapters/feeds/load";

// One feed for everything Andre publishes, each item pointing to where it lives (ADR 0009). Built with the page.
export const GET: APIRoute = async ({ site }) =>
  new Response(rssFeed(await loadLatest(), {
    title: "André Amnc",
    site: String(site ?? "https://andreamnc.com"),
    description: "Latest from andreamnc.com",   // Claude's words, waiting on Andre's
  }), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
