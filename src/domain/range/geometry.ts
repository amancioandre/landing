// Plates cover the screen; the original comp sits inside each plate at `inner`, so points written in the
// original's frame land in the same place at every elevation.
export interface Size { width: number; height: number }
export interface Rect extends Size { x: number; y: number }
export type Fraction4 = readonly [x: number, y: number, width: number, height: number];
export interface Frame { refWidth: number; aspect: number }   // aspect = height / width of the original

export function cover(plate: Size, screen: Size, anchorY: number): Rect {
  const s = Math.max(screen.width / plate.width, screen.height / plate.height);
  const width = plate.width * s, height = plate.height * s;
  return { x: (screen.width - width) / 2, y: (screen.height - height) * anchorY, width, height };
}

export function innerRect(plate: Rect, [ix, iy, iw, ih]: Fraction4): Rect {
  return { x: plate.x + ix * plate.width, y: plate.y + iy * plate.height, width: iw * plate.width, height: ih * plate.height };
}

export function toScreen([x, y]: readonly [number, number], original: Rect, frame: Frame): { x: number; y: number } {
  return {
    x: original.x + (x / frame.refWidth) * original.width,
    y: original.y + (y / (frame.refWidth * frame.aspect)) * original.height,
  };
}

const EDGE = 22;   // half a waypoint label plus breathing room
export const clampToScreen = (x: number, screenWidth: number) => Math.min(screenWidth - EDGE, Math.max(EDGE, x));
