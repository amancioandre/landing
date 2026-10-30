import { carousel, key, next, previous, select, swipe, type Carousel } from "../../domain/interests/carousel";
import { photoSpan } from "../../domain/interests/glyph-picture";
import { drawGlyphs } from "./glyph-drawer";

/** Binds the interests carousel to the page: one card in focus, the others in glyphs and out of reach. */
export function mountCarousel(root: HTMLElement, start: number): void {
  const track = root.querySelector<HTMLElement>("[data-track]")!;
  const slides = [...root.querySelectorAll<HTMLElement>("[data-slide]")];
  const entries = [...root.querySelectorAll<HTMLButtonElement>("[data-choose]")];
  let state: Carousel = carousel(slides.length, start);

  // The frontier: each photo shows only inside the focus slot; outside it the glyphs show through, with a soft edge.
  const SOFT_EDGE = 14;   // px over which the photo dissolves into its glyphs at the frontier
  const frontier = () => {
    const first = slides[0].querySelector<HTMLElement>(".figure")!;
    const viewport = root.querySelector<HTMLElement>(".viewport")!.getBoundingClientRect();
    const slot = { left: viewport.left + parseFloat(getComputedStyle(root).getPropertyValue("--lead") || "0"), width: first.offsetWidth };
    for (const slide of slides) {
      const fig = slide.querySelector<HTMLElement>(".figure")!, img = fig.querySelector("img"), box = fig.getBoundingClientRect();
      const { from, to } = photoSpan({ left: box.left, width: box.width }, slot);
      fig.dataset.from = from.toFixed(3); fig.dataset.to = to.toFixed(3);
      if (!img) continue;
      const a = from * box.width, b = to * box.width;
      img.style.maskImage = to <= from ? "linear-gradient(transparent, transparent)"
        : `linear-gradient(to right, transparent ${a > 0 ? a - SOFT_EDGE : -1}px, #000 ${a > 0 ? a + SOFT_EDGE : 0}px, #000 ${b < box.width ? b - SOFT_EDGE : box.width}px, transparent ${b < box.width ? b + SOFT_EDGE : box.width + 1}px)`;
    }
  };
  // While the strip slides, the frontier follows it frame by frame.
  let following = 0;
  const follow = () => {
    const until = performance.now() + 900;
    cancelAnimationFrame(following);
    const step = () => { frontier(); if (performance.now() < until) following = requestAnimationFrame(step); };
    step();
  };

  const show = (to: Carousel) => {
    state = to;
    track.style.setProperty("--focus", String(state.focus));
    slides.forEach((slide, i) => {
      const on = i === state.focus;
      slide.toggleAttribute("data-focus", on);
      slide.querySelector("[data-body]")!.toggleAttribute("inert", !on);
    });
    entries.forEach((b, i) => b.setAttribute("aria-pressed", String(i === state.focus)));
    follow();
  };

  entries.forEach((b, i) => b.addEventListener("click", () => show(select(state, i))));
  root.querySelectorAll<HTMLButtonElement>("[data-pick]").forEach((b, i) => b.addEventListener("click", () => show(select(state, i))));
  root.querySelector("[data-prev]")!.addEventListener("click", () => show(previous(state)));
  root.querySelector("[data-next]")!.addEventListener("click", () => show(next(state)));
  track.addEventListener("keydown", (e) => {
    const moved = key(state, e.key);
    if (moved) { e.preventDefault(); show(moved); }
  });
  let from: number | null = null;
  track.addEventListener("pointerdown", (e) => { from = e.clientX; });
  track.addEventListener("pointerup", (e) => { if (from !== null) show(swipe(state, e.clientX - from)); from = null; });

  // Each photo is drawn in glyphs once it has loaded, and again when the frame changes size.
  const draw = () => slides.forEach((slide) => {
    const img = slide.querySelector("img"), canvas = slide.querySelector("canvas");
    if (img && canvas) img.complete ? drawGlyphs(canvas, img) : img.addEventListener("load", () => drawGlyphs(canvas, img), { once: true });
  });
  let resizing: ReturnType<typeof setTimeout>;
  addEventListener("resize", () => { clearTimeout(resizing); resizing = setTimeout(draw, 200); });
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Where the strip starts: the column's left edge on wide screens; on phones, so the card in focus is centred.
  const frame = () => {
    const bleed = root.getBoundingClientRect().left, card = slides[0].offsetWidth;
    const lead = innerWidth < 700 ? Math.max(0, (innerWidth - card) / 2) : bleed;
    root.style.setProperty("--bleed", `${bleed}px`);
    root.style.setProperty("--lead", `${lead}px`);
  };
  addEventListener("resize", () => { frame(); frontier(); });

  // A link to #interest-<name> (from the menu) brings that card into focus.
  const fromHash = () => {
    const i = slides.findIndex((slide) => `#${slide.id}` === location.hash);
    if (i >= 0) show(select(state, i));
  };
  addEventListener("hashchange", fromHash);

  frame();
  show(state);
  fromHash();
  draw();
}
