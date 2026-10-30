import type { APIRoute } from "astro";
import { faviconIco } from "../adapters/favicon/icons";

export const GET: APIRoute = async () => new Response(await faviconIco(), { headers: { "Content-Type": "image/x-icon" } });
