// Where letters go (ADR 0023). The site key is public by design; its secret lives only in the Worker.
export const LETTER_SERVICE = {
  endpoint: "/letter",
  // Cloudflare's always-pass test key until Andre's invisible widget exists; swap before the next push.
  turnstileSiteKey: "1x00000000000000000000AA",
} as const;
