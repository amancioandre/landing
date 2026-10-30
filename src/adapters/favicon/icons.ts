import { glyphGrid, glyphRows, inMist, PEAK, pixelSquares, SUMMIT, withWaypoint } from "../../domain/favicon/peak";
import { glyphIcon, ICON_DAY, ICON_NIGHT, pixelIcon } from "../../domain/favicon/svg";
import { icoFrom } from "../../domain/favicon/ico";
import { rampFor } from "../../domain/range/elevation";
import { darknessOf, pngFrom } from "./plate";

// Small sizes are drawn pixel for pixel from the summit; large ones in the range's own glyphs (ADR 0026).
async function pixelDrawing(n: number, night = false) {
  const squares = withWaypoint(pixelSquares(inMist(await darknessOf(SUMMIT, n))), n);
  return pixelIcon(squares, n, ICON_DAY, night ? ICON_NIGHT : undefined);
}

async function glyphDrawing(size: number, inset = 0) {
  const rows = glyphRows(inMist(await darknessOf(PEAK, glyphGrid(size))), rampFor("ridge"));
  return glyphIcon(rows, size, ICON_DAY, { inset });
}

// Browsers draw favicon.svg at every size, so it carries the 32 px drawing: crisp at 32, still the peak at 16.
export const faviconSvg = () => pixelDrawing(32, true);

export async function faviconIco() {
  const images = await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await pngFrom(await pixelDrawing(size)) })));
  return icoFrom(images);
}

export const ICONS = {
  "apple-touch-icon": { size: 180, inset: 0 },
  "icon-192": { size: 192, inset: 0 },
  "icon-512": { size: 512, inset: 0 },
  "icon-maskable-512": { size: 512, inset: 0.1 },   // round masks keep the central 80%
} as const;
export type IconName = keyof typeof ICONS;

export const iconPng = async (name: IconName) => pngFrom(await glyphDrawing(ICONS[name].size, ICONS[name].inset));
