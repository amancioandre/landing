import type { APIRoute } from "astro";
import { SITE } from "../content/site";

// Every crawler is welcome, search and AI alike (GEO/AIO): the hub exists to be found and understood.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}sitemap.xml\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
