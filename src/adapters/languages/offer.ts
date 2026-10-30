import { LANGUAGES } from "../../domain/languages/languages";
import { suggestion } from "../../domain/languages/suggest";
import type { Offer } from "../../domain/languages/offer";

// Scripts are bundled once for every language, so the page carries every offer (rendered by the range).
export const OFFERS_ID = "language-offers";
const CHOSEN = "andreamnc.language-chosen";   // set once a reader picks a language themselves

const chosen = () => { try { return localStorage.getItem(CHOSEN) === "yes"; } catch { return false; } };
const remember = () => { try { localStorage.setItem(CHOSEN, "yes"); } catch { /* private mode: the offer may come back */ } };

/** Shows the language a reader's browser prefers, if the hub speaks it and they aren't reading it. */
export function mountOffer(link: HTMLAnchorElement): void {
  document.addEventListener("click", (e) => {
    if ((e.target as Element | null)?.closest("[data-choose-language]")) remember();
  });
  const reading = LANGUAGES.find((l) => l.tag === document.documentElement.lang);
  if (!reading) return;
  const offered = suggestion(navigator.languages ?? [navigator.language], reading, { chosen: chosen() });
  if (!offered) return;
  const offers: Offer[] = JSON.parse(document.getElementById(OFFERS_ID)!.textContent!);
  const offer = offers.find((o) => o.tag === offered.tag)!;
  link.href = offer.path;
  link.lang = link.hreflang = offer.tag;
  link.querySelector("[data-code]")!.textContent = offer.code;
  link.querySelector("[data-words]")!.textContent = offer.words;
  link.hidden = false;
}
