// Which ground is near, read from the plate's own tones (ADR 0006). Pure functions over a greyscale picture:
// one byte per pixel, row by row, 0 black to 255 white. Blurring the picture first is the adapter's job.

const START = 150;   // the walk begins at the first ink this dark near the foot...
const KEEP = 205;    // ...and keeps climbing while the ink stays at least this dark
const GAP = 6;       // light rows it may cross (between trees) before it stops
const SEARCH = 0.45; // how far up from the foot it looks for a start
const SLOPE = 3;     // ground never drops more than this many rows from one column to the next
const SEAM = 8;      // rows the mask takes to fade in

const slide = (values: number[], radius: number, pick: (window: number[]) => number) =>
  values.map((_, x) => pick(values.slice(Math.max(0, x - radius), x + radius + 1)));
const median = (w: number[]) => [...w].sort((a, b) => a - b)[w.length >> 1];

/** For each column, how many rows of near ground rise from the foot. */
export function nearGroundRise(gray: ArrayLike<number>, width: number, height: number): number[] {
  const top = new Array<number>(width).fill(height);
  for (let x = 0; x < width; x++) {
    let light = 0, started = false;
    for (let y = height - 1; y >= 0; y--) {
      const v = gray[y * width + x];
      if (!started) {
        if (v < START) { started = true; top[x] = y; } else if (y < height * (1 - SEARCH)) break;
        continue;
      }
      if (v < KEEP) { light = 0; top[x] = y; } else if (++light > GAP) break;
    }
  }
  // A forest edge, not a comb: neighbours' median, then narrow pits closed.
  let rise = slide(top.map((t) => height - t), 7, median);
  rise = slide(slide(rise, 12, (w) => Math.max(...w)), 12, (w) => Math.min(...w));
  for (let x = 1; x < width; x++) rise[x] = Math.max(rise[x], rise[x - 1] - SLOPE);
  for (let x = width - 2; x >= 0; x--) rise[x] = Math.max(rise[x], rise[x + 1] - SLOPE);
  return rise;
}

/** 255 where the ground is near, 0 above it, with a short seam so the bold glyphs never draw a line. */
export function nearGroundMask(rise: readonly number[], width: number, height: number): Uint8Array {
  const mask = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const t = (y - (height - rise[x]) + SEAM) / SEAM;
    mask[y * width + x] = Math.round(255 * Math.min(1, Math.max(0, t)));
  }
  return mask;
}

const DARK = 165, CREST_GAP = 9;   // a new ridge needs a real band of mist above it, not a gap between trees

/** For each pixel, how low its ridge's crest sits: lower crests are nearer. Used for the valley plate. */
export function crestDepth(gray: ArrayLike<number>, width: number, height: number): Uint8Array {
  const depth = new Uint8Array(width * height);
  for (let x = 0; x < width; x++) {
    let crest = -1, light = CREST_GAP;
    for (let y = 0; y < height; y++) {
      if (gray[y * width + x] < DARK) { if (light >= CREST_GAP) crest = y; light = 0; } else light++;
      depth[y * width + x] = crest < 0 ? 0 : Math.min(255, Math.round(255 * Math.max(0, (crest / height - 0.25) / 0.7)));
    }
  }
  return depth;
}

/** Averages each row sideways, never downward, so a ridge's rows stay locked together. */
export function smoothAcross(data: ArrayLike<number>, width: number, height: number, radius: number): Uint8Array {
  const out = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    let sum = 0, n = 0;
    for (let k = Math.max(0, x - radius); k <= Math.min(width - 1, x + radius); k++) { sum += data[y * width + k]; n++; }
    out[y * width + x] = Math.round(sum / n);
  }
  return out;
}
