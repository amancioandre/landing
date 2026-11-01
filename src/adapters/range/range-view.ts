import { boldFor, fogStrength, glyphCell, pickElevation, rampFor, type Elevation } from "../../domain/range/elevation";
import { clampToScreen, cover, innerRect, toScreen, type Rect } from "../../domain/range/geometry";
import { ORIGINAL, PLATES } from "../../content/plates";
import type { InterestStop } from "../../content/interests";
import { nearMap } from "./near-map";
import { nookShown } from "../../domain/range/night";
import { placeCards } from "../../domain/range/card-place";
import { AS_DRAWN, cellFor, lookOf, rampOf, type RangeSettings } from "../../domain/range/settings";
import { NIGHT } from "../../content/night";
import { RangeRenderer } from "./renderer";
import { seeInterest } from "../letter/visit";

const loadImage = (src: string) => new Promise<HTMLImageElement>((ok, fail) => {
  const img = new Image(); img.onload = () => ok(img); img.onerror = fail; img.src = src;
});

/** The first screen: lays the waypoints, index and card out from the domain, and hands the renderer its scene. */
export interface Range { apply(settings: RangeSettings): void }

export function mountRange(root: HTMLElement, stops: readonly InterestStop[]): Range {
  const canvas = root.querySelector("canvas")!;
  const waypoints = [...root.querySelectorAll<HTMLButtonElement>("[data-stop]")];
  const entries = [...root.querySelectorAll<HTMLButtonElement>("[data-entry]")];
  const holder = root.querySelector<HTMLElement>("[data-card]")!;
  const cards = [...holder.querySelectorAll<HTMLElement>("[data-card-for]")];
  const tether = root.querySelector<HTMLElement>("[data-tether]")!;
  const bar = document.querySelector<HTMLElement>("header.bar");
  const renderer = RangeRenderer.create(canvas);
  renderer?.setNightLook(NIGHT);
  const isNight = () => document.documentElement.dataset.theme === "night";
  let elevation: Elevation | null = null, plate: HTMLImageElement | null = null, original: Rect | null = null, coverRect: Rect | null = null;
  let chosen = -1;
  let settings = AS_DRAWN;

  const place = () => {
    if (!plate || !elevation) return;
    const screen = { width: root.clientWidth, height: root.clientHeight };
    coverRect = cover({ width: plate.naturalWidth, height: plate.naturalHeight }, screen, PLATES[elevation].anchorY);
    original = innerRect(coverRect, PLATES[elevation].inner);
    stops.forEach((stop, i) => {
      const p = toScreen(stop.at, original!, ORIGINAL);
      waypoints[i].style.left = `${clampToScreen(p.x, screen.width)}px`;
      waypoints[i].style.top = `${p.y}px`;
    });
    if (chosen >= 0) hang(chosen);
    if (!renderer) return;
    lightTheNook();
    renderer.layout({
      cover: coverRect, ramp: rampOf(settings.characters, rampFor(elevation)), cellPx: cellFor(glyphCell(elevation), settings.glyphSize), bold: boldFor(elevation),
      boldMist: PLATES[elevation].nearBy === "walk", fog: fogStrength(screen.width),
    });
  };

  const layout = async () => {
    const next = pickElevation(root.clientWidth, root.clientHeight);
    if (next !== elevation) {
      elevation = next;
      root.dataset.elevation = next;
      plate = await loadImage(PLATES[next].src);
      renderer?.setPlate(plate, nearMap(plate, PLATES[next].nearBy));
    }
    place();
  };

  // Every card hangs above its waypoint on the tether, on whichever side covers nothing (domain/range/card-place).
  // The range shows its cards one way: when any card can't hang clear, and always on phones, all open as a sheet.
  const index = root.querySelector<HTMLElement>(".index")!;
  const boxIn = (el: Element) => {
    const r = el.getBoundingClientRect(), o = root.getBoundingClientRect();
    return { x: r.left - o.left, y: r.top - o.top, width: r.width, height: r.height };
  };
  // Each card's size as it would hang, measured unseen one at a time (the cards differ in height).
  const hangingSizes = () => {
    const wasHidden = holder.hidden;
    holder.classList.remove("sheet");
    holder.style.visibility = "hidden";
    holder.hidden = false;
    const sizes = cards.map((card) => {
      cards.forEach((c) => (c.hidden = c !== card));
      return { width: holder.offsetWidth || 254, height: holder.offsetHeight };
    });
    cards.forEach((c, k) => (c.hidden = k !== chosen));
    holder.hidden = wasHidden;
    holder.style.visibility = "";
    return sizes;
  };
  const pointOf = (w: HTMLElement) => ({ x: parseFloat(w.style.left), y: parseFloat(w.style.top) });
  const hangingPlacements = () => {
    if (innerWidth < 700) return null;
    const sizes = hangingSizes();
    return placeCards({
      cards: waypoints.map((w, k) => ({
        at: pointOf(w), size: sizes[k], obstacles: [boxIn(index), ...waypoints.filter((_, j) => j !== k).map(boxIn)],
      })),
      screen: { width: root.clientWidth, height: root.clientHeight }, top: 96,
    });
  };
  const hang = (i: number) => {
    seeInterest(holder, cards[i]?.dataset.cardFor);
    const { x, y } = pointOf(waypoints[i]);
    const place = hangingPlacements()?.[i] ?? null;
    holder.classList.toggle("sheet", !place);
    tether.hidden = !place;
    if (place) {
      holder.classList.toggle("flip", place.side === "left");
      holder.style.left = `${place.left}px`;
      holder.style.top = `${place.top}px`;
      tether.style.left = `${x - 0.75}px`;
      tether.style.top = `${place.top}px`;
      tether.style.height = `${Math.max(0, y - 32 - place.top)}px`;
    }
    if (coverRect) renderer?.setFocus({ x: (x - coverRect.x) / coverRect.width, y: (y - coverRect.y) / coverRect.height });
  };

  // Snap back to the closed state without a transition, then open again, so the motion plays every time.
  const replay = (el: HTMLElement, cls: string) => {
    el.style.transition = "none";            // snap back instantly, or the reset itself animates and cancels the replay
    el.classList.remove(cls);
    void el.offsetWidth;
    el.style.transition = "";
    el.classList.add(cls);
  };

  const choose = (i: number) => {
    if (i === chosen && !holder.hidden) return;   // hovering the open card again doesn't restart it
    chosen = i;
    cards.forEach((card, k) => (card.hidden = k !== i));
    [...waypoints, ...entries].forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.i) === i)));
    holder.hidden = false;
    hang(i);
    replay(holder, "open");
    replay(tether, "drawn");
  };
  const close = () => {
    chosen = -1;
    holder.hidden = true; tether.hidden = true; holder.classList.remove("open"); tether.classList.remove("drawn");
    [...waypoints, ...entries].forEach((b) => b.setAttribute("aria-pressed", "false"));
    renderer?.setFocus(null);
  };

  for (const b of [...waypoints, ...entries]) {
    b.addEventListener("click", () => choose(Number(b.dataset.i)));
    b.addEventListener("mouseenter", () => choose(Number(b.dataset.i)));
  }
  // A click anywhere off the card puts it away (ADR 0013).
  document.addEventListener("click", (e) => {
    if (chosen >= 0 && !(e.target as Element).closest("[data-card], [data-stop], [data-entry], [data-settings], [data-settings-open]")) close();
  });

  // The bar's interest links lead to the carousel's cards; when the Now holds section 02 instead, they open the range's.
  document.addEventListener("click", (e) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#interest-"]');
    if (!link || document.getElementById(link.hash.slice(1))) return;
    const i = stops.findIndex((s) => link.hash === `#interest-${s.name.toLowerCase()}`);
    if (i < 0) return;
    e.preventDefault();
    scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    choose(i);
  });

  // Leaving the range: labels fade, the bar docks on paper, and the renderer rests once it is out of sight.
  const onScroll = () => {
    const h = root.offsetHeight, leave = Math.min(1, Math.max(0, scrollY / (h * 0.45)));
    root.style.setProperty("--leave", leave.toFixed(3));
    root.toggleAttribute("data-leaving", leave > 0.6);
    bar?.toggleAttribute("data-docked", scrollY > h - (bar?.offsetHeight ?? 0) - 24);
    renderer?.setEdge(Math.min(1, scrollY / (innerHeight * 0.15)));
    renderer?.setVisible(scrollY < h);
  };
  addEventListener("scroll", onScroll, { passive: true });

  // The nook between 02 and 03 glows at night on bigger screens; it sits in the original's frame like the waypoints.
  function lightTheNook() {
    if (!renderer || !original || !coverRect) return;
    const p = toScreen(NIGHT.nook.at, original, ORIGINAL);
    const on = nookShown({ night: isNight(), width: root.clientWidth });
    renderer.setNook(on ? { x: (p.x - coverRect.x) / coverRect.width, y: (p.y - coverRect.y) / coverRect.height } : null);
  }

  // Day or night follows the visitor's sun (ADR 0018), set on <html> by adapters/daylight.
  const night = () => { renderer?.setNight(isNight()); lightTheNook(); };
  new MutationObserver(night).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  let resizing: ReturnType<typeof setTimeout>;
  addEventListener("resize", () => { clearTimeout(resizing); resizing = setTimeout(layout, 150); });
  layout().then(() => { night(); onScroll(); renderer?.start(); });

  return {
    // The visitor's settings: the look at once; the glyphs' size and characters need the range laid out again.
    apply(next) {
      const redraw = next.glyphSize !== settings.glyphSize || next.characters !== settings.characters;
      settings = next;
      renderer?.setLook(lookOf(next));
      if (redraw) place();
    },
  };
}
