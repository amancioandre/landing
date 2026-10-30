import type { APIRoute } from "astro";
import { SITE } from "../content/site";
import { LANGUAGES, alternates, pathFor } from "../domain/languages/languages";

// One page (ADR 0009) in every language, each entry naming the others so search engines pair them.
export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const others = alternates(SITE.url).map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`);
  const urls = LANGUAGES.map((l) => [
    "  <url>",
    `    <loc>${new URL(pathFor(l), SITE.url).href}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    ...others,
    "  </url>",
  ].join("\n"));
  return new Response([
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
  ].join("\n"), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
