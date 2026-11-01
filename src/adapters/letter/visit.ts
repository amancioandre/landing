// What the page notices about a visit, sent with a letter so Andre knows its context (ADR 0024).
import type { Visit } from "../../domain/letter/delivery";

export const INTEREST_SEEN = "interest-seen";   // the range announces the interest a visitor looks at

let lastInterest: string | undefined;
let listening = false;

function arrivedFrom(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const from = new URL(document.referrer);
    return from.host === location.host ? undefined : `${from.origin}${from.pathname}${from.search}`;
  } catch {
    return undefined;
  }
}

function campaign(): string | undefined {
  const query = new URLSearchParams(location.search);
  const tags = ["utm_source", "utm_medium", "utm_campaign"].map((k) => query.get(k)).filter(Boolean);
  return tags.length ? tags.join(" / ") : undefined;
}

const device = (): Visit["device"] =>
  matchMedia("(max-width: 699px)").matches ? "phone" : matchMedia("(pointer: coarse)").matches ? "tablet" : "computer";

const sky = (): Visit["sky"] => (document.documentElement.dataset.theme === "night" ? "night" : "day");

/** Starts noticing; the arrival is read once, at load, before any in-page navigation. */
export function noticeVisit(): (via: NonNullable<Visit["via"]>) => Visit {
  const from = arrivedFrom(), tags = campaign();
  if (!listening) {
    document.addEventListener(INTEREST_SEEN, (e) => { lastInterest = (e as CustomEvent<string>).detail; });
    listening = true;
  }
  return (via) => ({ via, from, campaign: tags, interest: lastInterest, device: device(), sky: sky() });
}

/** Announces the interest a visitor is looking at. */
export const seeInterest = (from: Element, name: string | undefined) => {
  if (name) from.dispatchEvent(new CustomEvent(INTEREST_SEEN, { bubbles: true, detail: name }));
};
