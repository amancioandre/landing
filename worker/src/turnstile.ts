import type { Desk } from "./letter-desk";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
export const LETTER_ACTION = "letter";   // the page names its pass for this; the Worker accepts no other
const MAX_TOKEN = 2048;

interface Verdict { success?: boolean; hostname?: string; action?: string }

/** Asks Cloudflare whether the page's one-time pass is genuine, made for a letter, on Andre's domain. */
export function turnstileCheck(secret: string, fetcher: typeof fetch = fetch, hostname = "andreamnc.com"): Desk["isHuman"] {
  return async (token, ip) => {
    if (token.length === 0 || token.length > MAX_TOKEN) return false;
    const form = new FormData();
    form.set("secret", secret);
    form.set("response", token);
    if (ip) form.set("remoteip", ip);
    try {
      const res = await fetcher(SITEVERIFY, { method: "POST", body: form, signal: AbortSignal.timeout(10_000) });
      if (!res.ok) return false;
      const verdict = (await res.json()) as Verdict;
      return verdict.success === true && verdict.hostname === hostname && verdict.action === LETTER_ACTION;
    } catch {
      return false;   // Cloudflare unreachable: no pass, no letter
    }
  };
}
