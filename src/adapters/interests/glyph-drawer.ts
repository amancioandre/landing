import { glyphFor, inkAt, SOFT, type Focus } from "../../domain/interests/glyph-picture";


/** Draws a photo in glyphs onto a transparent canvas, in the canvas's text colour, so both themes follow. */
export function drawGlyphs(canvas: HTMLCanvasElement, img: HTMLImageElement, focus: Focus): void {
  const width = canvas.clientWidth, height = canvas.clientHeight;
  if (!width || !height || !img.naturalWidth) return;
  const dpr = Math.min(3, devicePixelRatio || 1), cw = 3, ch = 5;   // fine cells: more detail in each picture
  const cols = Math.ceil(width / cw), rows = Math.ceil(height / ch);

  // The photo at one pixel per cell, cropped like object-fit: cover, and a blurred copy for the tone around each cell.
  const sample = (blur: number) => {
    const c = document.createElement("canvas");
    c.width = cols; c.height = rows;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    const s = Math.max(width / img.naturalWidth, height / img.naturalHeight), sw = width / s, sh = height / s;
    g.filter = blur ? `blur(${blur}px)` : "none";
    g.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
    return g.getImageData(0, 0, cols, rows).data;
  };
  const tone = sample(0), around = sample(4);
  const lum = (d: Uint8ClampedArray, k: number) => (d[k] * 0.299 + d[k + 1] * 0.587 + d[k + 2] * 0.114) / 255;

  canvas.width = width * dpr; canvas.height = height * dpr;
  const g = canvas.getContext("2d")!;
  g.scale(dpr, dpr);
  g.clearRect(0, 0, width, height);
  g.fillStyle = getComputedStyle(canvas).color;
  g.font = `${ch}px ${getComputedStyle(document.documentElement).getPropertyValue("--mono") || "monospace"}`;
  g.textBaseline = "top";
  for (let r = 0; r < rows; r++) for (let x = 0; x < cols; x++) {
    const k = (r * cols + x) * 4;
    const ink = inkAt({ u: (x + 0.5) / cols, v: (r + 0.5) / rows, lum: lum(tone, k), mean: lum(around, k) }, focus, SOFT);
    if (ink > 0) g.fillText(glyphFor(ink), x * cw, r * ch);
  }
}
