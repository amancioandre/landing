import type { Desk } from "./letter-desk";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Asks Cloudflare whether the page's one-time pass is genuine, and was issued on Andre's domain. */
export function turnstileCheck(secret: string, fetcher: typeof fetch = fetch, hostname = "andreamnc.com"): Desk["isHuman"] {
  return async (token, ip) => {
    const form = new FormData();
    form.set("secret", secret);
    form.set("response", token);
    if (ip) form.set("remoteip", ip);
    const verdict = (await (await fetcher(SITEVERIFY, { method: "POST", body: form })).json()) as { success?: boolean; hostname?: string };
    return verdict.success === true && verdict.hostname === hostname;
  };
}
