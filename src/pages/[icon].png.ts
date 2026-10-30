import type { APIRoute, GetStaticPaths } from "astro";
import { iconPng, ICONS, type IconName } from "../adapters/favicon/icons";

// The home-screen and manifest icons, in the range's glyphs (ADR 0026).
export const getStaticPaths: GetStaticPaths = () => Object.keys(ICONS).map((icon) => ({ params: { icon } }));

export const GET: APIRoute = async ({ params }) =>
  new Response(await iconPng(params.icon as IconName), { headers: { "Content-Type": "image/png" } });
