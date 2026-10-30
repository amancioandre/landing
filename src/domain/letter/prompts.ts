// Andre's prompts rotate above the letter. Every few prompts one of the asks comes back, a different one each time.
export function interleave(prompts: readonly string[], asks: readonly string[], every: number): string[] {
  if (asks.length === 0) return [...prompts];
  return prompts.flatMap((prompt, i) => (i % every === 0 ? [asks[(i / every) % asks.length], prompt] : [prompt]));
}

// Han, kana, Hangul and full-width forms take two columns on screen; Latin and Cyrillic take one.
const WIDE = /[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/u;
const columns = (text: string) => [...text].reduce((n, ch) => n + (WIDE.test(ch) ? 2 : 1), 0);

// The bar only types prompts short enough to stay on one line; the long ones live in the section.
export function shortEnough(prompts: readonly string[], maxColumns: number): string[] {
  return prompts.filter((p) => columns(p) <= maxColumns);
}
