// The feed relay (ADR 0030): one fixed address in, one fixed feed out. Substack turns GitHub's servers away, so the
// collector reads Andre's feed through andreamnc.com. Nothing from the request reaches the address it fetches.
export const FEED = "https://andramnc.substack.com/feed";
const PATH = "/feeds/substack";

export type Fetcher = (url: string) => Promise<Response>;

export async function relay(request: Request, fetcher: Fetcher): Promise<Response> {
  if (new URL(request.url).pathname !== PATH) return new Response("Not found", { status: 404 });
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("Only reads", { status: 405, headers: { allow: "GET, HEAD" } });
  const res = await fetcher(FEED);
  if (!res.ok) return new Response(`Substack answered ${res.status}`, { status: 502 });
  return new Response(res.body, {
    headers: { "content-type": res.headers.get("content-type") ?? "application/xml", "cache-control": "public, max-age=600" },
  });
}
