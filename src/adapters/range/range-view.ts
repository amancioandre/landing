import { boldFor, fogStrength, glyphCell, pickElevation, rampFor, type Elevation } from "../../domain/range/elevation";
import { clampToScreen, cover, innerRect, toScreen, type Rect } from "../../domain/range/geometry";
import { ORIGINAL, PLATES, RIVER } from "../../content/plates";
import type { InterestStop } from "../../content/interests";
import { nearMap } from "./near-map";
import { RangeRenderer } from "./renderer";

const loadImage = (src: string) => new Promise<HTMLImageElement>((ok, fail) => {
  const img = new Image(); img.onload = () => ok(img); img.onerror = fail; img.src = src;
});

/** The first screen: lays the waypoints, index and card out from the domain, and hands the renderer its scene. */
export function mountRange(root: HTMLElement, stops: readonly InterestStop[]): void {
  const canvas = root.querySelector("canvas")!;
  const waypoints = [...root.querySelectorAll<HTMLButtonElement>("[data-stop]")];
  const entries = [...root.querySelectorAll<HTMLButtonElement>("[data-entry]")];
  const holder = root.querySelector<HTMLElement>("[data-card]")!;
  const cards = [...holder.querySelectorAll<HTMLElement>("[data-card-for]")];
  const tether = root.querySelector<HTMLElement>("[data-tether]")!;
  const bar = document.querySelector<HTMLElement>("header.bar");
  const renderer = RangeRenderer.create(canvas);
  let elevation: Elevation | null = null, plate: HTMLImageElement | null = null, original: Rect | null = null, coverRect: Rect | null = null;
  let chosen = -1;

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
    const [ix, iy, iw, ih] = PLATES[elevation].inner, f = ORIGINAL.refWidth, r = f * ORIGINAL.aspect;
    renderer.layout({
      cover: coverRect, ramp: rampFor(elevation), cellPx: glyphCell(elevation), bold: boldFor(elevation),
      boldMist: PLATES[elevation].nearBy === "walk", fog: fogStrength(screen.width),
      water: [ix + (RIVER[0] / f) * iw, iy + (RIVER[1] / r) * ih, ix + (RIVER[2] / f) * iw, iy + (RIVER[3] / r) * ih],
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

  // The card hangs above its waypoint on the tether; near the right edge it flips. On phones it is a sheet.
  const hang = (i: number) => {
    const at = waypoints[i];
    const x = parseFloat(at.style.left), y = parseFloat(at.style.top);
    const width = holder.offsetWidth || 260, flip = x + width > root.clientWidth - 16;
    const top = Math.max(96, y - 30 - holder.offsetHeight);
    holder.classList.toggle("flip", flip);
    holder.style.left = `${flip ? x - width : x}px`;
    holder.style.top = `${top}px`;
    tether.style.left = `${x - 0.75}px`;
    tether.style.top = `${top}px`;
    tether.style.height = `${Math.max(0, y - 32 - top)}px`;
    if (coverRect) renderer?.setFocus({ x: (x - coverRect.x) / coverRect.width, y: (y - coverRect.y) / coverRect.height });
  };

  const choose = (i: number) => {
    chosen = i;
    cards.forEach((card, k) => (card.hidden = k !== i));
    [...waypoints, ...entries].forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.i) === i)));
    holder.hidden = false;
    tether.hidden = false;
    hang(i);
    holder.classList.remove("open"); void holder.offsetWidth; holder.classList.add("open");   // the motion plays every time
  };
  const close = () => {
    chosen = -1;
    holder.hidden = true; tether.hidden = true; holder.classList.remove("open");
    [...waypoints, ...entries].forEach((b) => b.setAttribute("aria-pressed", "false"));
    renderer?.setFocus(null);
  };

  for (const b of [...waypoints, ...entries]) {
    b.addEventListener("click", () => choose(Number(b.dataset.i)));
    b.addEventListener("mouseenter", () => choose(Number(b.dataset.i)));
  }
  // A click anywhere off the card puts it away (ADR 0013).
  document.addEventListener("click", (e) => {
    if (chosen >= 0 && !(e.target as Element).closest("[data-card], [data-stop], [data-entry]")) close();
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

  // Light or night follows the page's theme (a switcher is planned).
  const night = () => renderer?.setNight(document.documentElement.dataset.theme === "dark");
  new MutationObserver(night).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  let resizing: ReturnType<typeof setTimeout>;
  addEventListener("resize", () => { clearTimeout(resizing); resizing = setTimeout(layout, 150); });
  layout().then(() => { night(); onScroll(); renderer?.start(); });
}
