// An .ico is a directory of PNGs (Windows Vista onward); every browser that still asks for /favicon.ico reads it.
export interface IcoImage { size: number; png: Uint8Array }

export function icoFrom(images: readonly IcoImage[]): Uint8Array {
  const header = 6, entry = 16;
  const total = header + entry * images.length + images.reduce((sum, i) => sum + i.png.length, 0);
  const out = new Uint8Array(total), view = new DataView(out.buffer);
  view.setUint16(2, 1, true);                       // type 1: icon
  view.setUint16(4, images.length, true);
  let offset = header + entry * images.length;
  images.forEach(({ size, png }, i) => {
    const at = header + entry * i, side = size >= 256 ? 0 : size;
    out[at] = side; out[at + 1] = side;
    view.setUint16(at + 4, 1, true);                // colour planes
    view.setUint16(at + 6, 32, true);               // bits per pixel
    view.setUint32(at + 8, png.length, true);
    view.setUint32(at + 12, offset, true);
    out.set(png, offset);
    offset += png.length;
  });
  return out;
}
