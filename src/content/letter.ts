// Where letters go (ADR 0023). The site key is public by design; its secret lives only in the Worker.
export const LETTER_SERVICE = {
  endpoint: "/letter",
  // Andre's widget, 2026-10-29.
  turnstileSiteKey: "0x4AAAAAAFsMmr_4Ql21QTux",
} as const;
