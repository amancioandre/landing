import type { Elevation } from "../domain/range/elevation";
import type { Fraction4, Frame } from "../domain/range/geometry";

// Provenance: AI ink-wash plates (Higgsfield, 2026-10-29), the valley and landscape outpainted from the ridge
// original; stored as greyscale (the red channel the shader reads). `inner` is where the original sits in each.
export interface Plate { src: string; inner: Fraction4; anchorY: number; nearBy: "walk" | "crest" }

export const PLATES: Record<Elevation, Plate> = {
  ridge: { src: "/range/ridge.png", inner: [0, 0, 1, 1], anchorY: 0.5, nearBy: "walk" },
  valley: { src: "/range/valley.png", inner: [0, 948 / 2752, 1534 / 1536, 867 / 2752], anchorY: 0.78, nearBy: "crest" },
  landscape: { src: "/range/landscape.png", inner: [400 / 3168, 4 / 1344, 2371 / 3168, 1340 / 1344], anchorY: 0.5, nearBy: "walk" },
};

// Points on the range are written in the original comp's 2000-wide frame.
export const ORIGINAL: Frame = { refWidth: 2000, aspect: 1520 / 2688 };
export const RIVER = [1225, 900, 1575, 1020] as const;
