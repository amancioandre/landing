import sharp from "sharp";
import { join } from "node:path";
import type { Crop, Darkness } from "../../domain/favicon/peak";

const PLATE = join(process.cwd(), "public/range/landscape.png");

/** The plate's darkness inside `crop`, stretched to its full range and sampled on an n×n grid. */
export async function darknessOf(crop: Crop, n: number): Promise<Darkness> {
  // Cropped first, in its own pass, so the contrast is stretched over the peak alone and not the whole plate.
  const peak = await sharp(PLATE).greyscale().extract(crop).png().toBuffer();
  const { data, info } = await sharp(peak).normalise().resize(n, n, { kernel: "lanczos3" }).raw().toBuffer({ resolveWithObject: true });
  return Array.from({ length: n }, (_, y) => Array.from({ length: n }, (_, x) => 1 - data[(y * n + x) * info.channels] / 255));
}

export async function pngFrom(svg: string): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer());
}
