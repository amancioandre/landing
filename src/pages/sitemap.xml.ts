import type { APIRoute } from "astro";
import { SITE } from "../content/site";

// One page today (ADR 0009); the feed is listed for discovery too.
export const GET: APIRoute = () =>
  new Response([
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${SITE.url}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`,
    "</urlset>",
  ].join("\n"), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
