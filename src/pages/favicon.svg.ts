import type { APIRoute } from "astro";
import { faviconSvg } from "../adapters/favicon/icons";

// The range's peak in the tab, turning to night with the browser's bar (ADR 0026). Built with the page.
export const GET: APIRoute = async () => new Response(await faviconSvg(), { headers: { "Content-Type": "image/svg+xml" } });
