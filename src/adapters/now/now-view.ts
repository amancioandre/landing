import { carousel, key, next, previous, select, type Carousel } from "../../domain/interests/carousel";

const pad = (i: number) => String(i).padStart(2, "0");

/** Binds the Now to the page: the arrows and keys step one card at a time; a swipe or a trackpad moves the focus with it. */
export function mountNow(root: HTMLElement): void {
  const strip = root.querySelector<HTMLElement>("[data-strip]")!;
  const cards = [...root.querySelectorAll<HTMLElement>("[data-now-card]")];
  const count = root.querySelector<HTMLElement>("[data-count]")!;
  const [back, on] = [root.querySelector<HTMLButtonElement>("[data-prev]")!, root.querySelector<HTMLButtonElement>("[data-next]")!];
  const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  let state: Carousel = carousel(cards.length);
  let steering = false;   // while the page moves the strip itself, its scrolling doesn't choose the focus

  const show = (to: Carousel, move: boolean) => {
    state = to;
    cards.forEach((card, i) => card.toggleAttribute("data-focus", i === state.focus));
    count.textContent = `${pad(state.focus + 1)} / ${pad(state.count)}`;
    back.disabled = state.focus === 0;
    on.disabled = state.focus === state.count - 1;
    if (!move) return;
    const left = cards[state.focus].offsetLeft - cards[0].offsetLeft;
    if (Math.abs(strip.scrollLeft - left) < 1) return;   // already there: no scroll, so no scrollend to wait for
    steering = true;
    strip.scrollTo({ left, behavior: smooth() });
  };

  const nearest = () => {
    const start = strip.getBoundingClientRect().left;
    let best = 0;
    cards.forEach((card, i) => { if (Math.abs(card.getBoundingClientRect().left - start) < Math.abs(cards[best].getBoundingClientRect().left - start)) best = i; });
    return best;
  };
  const settled = () => {
    if (steering) { steering = false; return; }
    show(select(state, nearest()), false);
  };
  // Browsers without scrollend settle the strip once it has been still for a moment.
  if ("onscrollend" in window) strip.addEventListener("scrollend", settled);
  else { let still = 0; strip.addEventListener("scroll", () => { clearTimeout(still); still = window.setTimeout(settled, 120); }); }

  back.addEventListener("click", () => show(previous(state), true));
  on.addEventListener("click", () => show(next(state), true));
  strip.addEventListener("keydown", (e) => {
    const to = key(state, e.key);
    if (!to) return;
    e.preventDefault();
    show(to, true);
  });
  show(state, false);
}
