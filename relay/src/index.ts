// The relay's composition root: Cloudflare's fetch, cached for ten minutes at the edge (ADR 0030).
import { relay } from "./relay";

export default {
  fetch(request: Request): Promise<Response> {
    return relay(request, (url) => fetch(url, { cf: { cacheTtl: 600, cacheEverything: true } }));
  },
} satisfies ExportedHandler;
