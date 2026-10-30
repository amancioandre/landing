// Andre's prompts rotate above the letter. Every few prompts one of the asks comes back, a different one each time.
export function interleave(prompts: readonly string[], asks: readonly string[], every: number): string[] {
  if (asks.length === 0) return [...prompts];
  return prompts.flatMap((prompt, i) => (i % every === 0 ? [asks[(i / every) % asks.length], prompt] : [prompt]));
}

// The bar only types prompts short enough to stay on one line; the long ones live in the section.
export function shortEnough(prompts: readonly string[], maxLength: number): string[] {
  return prompts.filter((p) => p.length <= maxLength);
}
