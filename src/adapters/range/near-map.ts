import { crestDepth, nearGroundMask, nearGroundRise, smoothAcross } from "../../domain/range/near-ground";

// Reads a plate's tones at a small size, asks the domain which ground is near, and returns a soft map for the shader.
function greyAt(img: HTMLImageElement, width: number, blurPx: number) {
  const height = Math.round((width * img.naturalHeight) / img.naturalWidth);
  const c = document.createElement("canvas");
  c.width = width; c.height = height;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.filter = `blur(${blurPx}px)`;
  g.drawImage(img, 0, 0, width, height);
  const rgba = g.getImageData(0, 0, width, height).data;
  const gray = new Uint8Array(width * height);
  for (let i = 0; i < gray.length; i++) gray[i] = rgba[i * 4];
  return { gray, width, height };
}

function toCanvas(values: Uint8Array, width: number, height: number, blurPx: number): HTMLCanvasElement {
  const raw = document.createElement("canvas");
  raw.width = width; raw.height = height;
  const image = raw.getContext("2d")!.createImageData(width, height);
  values.forEach((v, i) => { image.data.set([v, v, v, 255], i * 4); });
  raw.getContext("2d")!.putImageData(image, 0, 0);
  if (!blurPx) return raw;
  const soft = document.createElement("canvas");
  soft.width = width; soft.height = height;
  const g = soft.getContext("2d")!;
  g.filter = `blur(${blurPx}px)`;
  g.drawImage(raw, 0, 0);
  return soft;
}

/** Ridge and landscape: the connected walk up from the foot. Valley: crest height, averaged sideways. */
export function nearMap(img: HTMLImageElement, by: "walk" | "crest"): HTMLCanvasElement {
  if (by === "walk") {
    const { gray, width, height } = greyAt(img, 640, 1.5);
    return toCanvas(nearGroundMask(nearGroundRise(gray, width, height), width, height), width, height, 3);
  }
  const { gray, width, height } = greyAt(img, 480, 2);
  return toCanvas(smoothAcross(crestDepth(gray, width, height), width, height, 36), width, height, 0);
}
