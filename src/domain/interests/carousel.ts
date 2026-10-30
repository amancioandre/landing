// The interests read sideways: one card in focus, the rest waiting either side.
export interface Carousel { readonly count: number; readonly focus: number }

const clamp = (c: Carousel, i: number): Carousel => ({ ...c, focus: Math.min(c.count - 1, Math.max(0, i)) });

export const carousel = (count: number, focus = 0): Carousel => clamp({ count, focus: 0 }, focus);
export const select = (c: Carousel, i: number) => clamp(c, i);
export const next = (c: Carousel) => clamp(c, c.focus + 1);
export const previous = (c: Carousel) => clamp(c, c.focus - 1);

const KEYS: Record<string, (c: Carousel) => Carousel> = {
  ArrowRight: next, ArrowLeft: previous, Home: (c) => select(c, 0), End: (c) => select(c, c.count - 1),
};
/** The carousel after a key, or null when the key isn't one it answers. */
export const key = (c: Carousel, name: string): Carousel | null => KEYS[name]?.(c) ?? null;

const SWIPE = 40;   // px: anything shorter is a tap or a wobble
/** dx is how far the finger travelled: leftward (negative) brings the next card in. */
export const swipe = (c: Carousel, dx: number) => (Math.abs(dx) < SWIPE ? c : dx < 0 ? next(c) : previous(c));
