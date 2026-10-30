import { THEMES } from "../../design/tokens";
import { waypoint, type Square } from "./peak";

export interface Palette { paper: string; ink: string; signal: string }
export const ICON_DAY: Palette = { paper: THEMES.day.paper, ink: THEMES.day.ink, signal: THEMES.day.signal };
export const ICON_NIGHT: Palette = { paper: THEMES.night.paper, ink: THEMES.night.ink, signal: THEMES.night.signal };

const fills = ({ paper, ink, signal }: Palette) => `.p{fill:${paper}}.i{fill:${ink}}.s{fill:${signal}}`;

// The icon follows the browser's bar, not the page's sun: a tab bar is light or dark by the visitor's own setting.
function style(day: Palette, night?: Palette) {
  return `<style>${fills(day)}${night ? `@media (prefers-color-scheme: dark){${fills(night)}}` : ""}</style>`;
}

export function pixelIcon(squares: readonly Square[], n: number, day: Palette, night?: Palette): string {
  const cells = squares.map((s) => `<rect class="${s.role === "ink" ? "i" : "s"}" x="${s.x}" y="${s.y}" width="${s.size}" height="${s.size}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges">`
    + `${style(day, night)}<rect class="p" width="${n}" height="${n}"/>${cells}</svg>`;
}

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const round = (v: number) => Math.round(v * 100) / 100;

/** Each glyph is placed in its own cell, so the drawing doesn't depend on the font's advance width. */
export function glyphIcon(rows: readonly string[], n: number, palette: Palette, { inset = 0 } = {}): string {
  const g = rows.length, cell = n / g;
  const lines = rows.flatMap((r, y) => [...r].flatMap((ch, x) =>
    ch === " " ? [] : [`<text x="${round(x * cell)}" y="${round((y + 0.82) * cell)}">${escape(ch)}</text>`])).join("");
  // One glyph cell of red, as small beside the glyphs as a waypoint's number is on the page.
  const red = waypoint(g), size = cell * 1.1, ring = cell * 0.6;
  const mark = `<rect class="p" x="${round(red.x * cell - ring)}" y="${round(red.y * cell - ring)}" width="${round(size + 2 * ring)}" height="${round(size + 2 * ring)}"/>`
    + `<rect class="s" x="${round(red.x * cell)}" y="${round(red.y * cell)}" width="${round(size)}" height="${round(size)}"/>`;
  const art = `<g class="i" font-family="DejaVu Sans Mono, Menlo, Consolas, monospace" font-weight="700" font-size="${round(cell * 1.05)}">${lines}</g>${mark}`;
  const s = 1 - 2 * inset;
  const placed = inset ? `<g transform="translate(${round(n * inset)} ${round(n * inset)}) scale(${round(s)})">${art}</g>` : art;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" viewBox="0 0 ${n} ${n}">`
    + `${style(palette)}<rect class="p" width="${n}" height="${n}"/>${placed}</svg>`;
}
