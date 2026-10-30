import type { APIRoute } from "astro";
import { webManifest } from "../domain/favicon/manifest";
import { SITE } from "../content/site";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(webManifest(SITE.name)), { headers: { "Content-Type": "application/manifest+json" } });
