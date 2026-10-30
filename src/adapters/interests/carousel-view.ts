import { carousel, key, next, previous, select, swipe, type Carousel } from "../../domain/interests/carousel";
import type { InterestStop } from "../../content/interests";
import { drawGlyphs } from "./glyph-drawer";

/** Binds the interests carousel to the page: one card in focus, the others in glyphs and out of reach. */
export function mountCarousel(root: HTMLElement, stops: readonly InterestStop[], start: number): void {
  const track = root.querySelector<HTMLElement>("[data-track]")!;
  const slides = [...root.querySelectorAll<HTMLElement>("[data-slide]")];
  const entries = [...root.querySelectorAll<HTMLButtonElement>("[data-choose]")];
  let state: Carousel = carousel(slides.length, start);

  const show = (to: Carousel) => {
    state = to;
    track.style.setProperty("--focus", String(state.focus));
    slides.forEach((slide, i) => {
      const on = i === state.focus;
      slide.toggleAttribute("data-focus", on);
      slide.querySelector("[data-body]")!.toggleAttribute("inert", !on);
    });
    entries.forEach((b, i) => b.setAttribute("aria-pressed", String(i === state.focus)));
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
  const draw = () => slides.forEach((slide, i) => {
    const img = slide.querySelector("img"), canvas = slide.querySelector("canvas"), focus = stops[i].photo?.focus;
    if (img && canvas && focus) img.complete ? drawGlyphs(canvas, img, focus) : img.addEventListener("load", () => drawGlyphs(canvas, img, focus), { once: true });
  });
  let resizing: ReturnType<typeof setTimeout>;
  addEventListener("resize", () => { clearTimeout(resizing); resizing = setTimeout(draw, 200); });
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  show(state);
  draw();
}
