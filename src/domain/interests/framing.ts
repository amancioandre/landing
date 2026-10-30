// Where a photo sits in a frame of another shape: covered, and slid toward its subject.
export interface Size { width: number; height: number }
export interface Crop { x: number; y: number; width: number; height: number }
export type Focus = readonly [number, number];   // 0..1 across and down, as CSS object-position reads it

export const CENTRE: Focus = [0.5, 0.5];

export function cropFor(photo: Size, frame: Size, [fx, fy]: Focus): Crop {
  const scale = Math.max(frame.width / photo.width, frame.height / photo.height);
  const width = Math.min(photo.width, Math.round(frame.width / scale)), height = Math.min(photo.height, Math.round(frame.height / scale));
  return { x: Math.round((photo.width - width) * fx), y: Math.round((photo.height - height) * fy), width, height };
}

export const objectPosition = ([fx, fy]: Focus) => `${Math.round(fx * 100)}% ${Math.round(fy * 100)}%`;
