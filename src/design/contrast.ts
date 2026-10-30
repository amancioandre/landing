// WCAG 2 relative luminance and contrast ratio, for checking the palette against the AA bar.
type Hex = `#${string}`;

const channel = (hex: Hex, at: number) => parseInt(hex.slice(at, at + 2), 16) / 255;
const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function luminance(hex: Hex): number {
  const [r, g, b] = [1, 3, 5].map((at) => linear(channel(hex, at)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: Hex, b: Hex): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
