// The bar's "write to me" types a prompt, holds it, erases it and types the next. A click locks the prompt in place.
export type Phase = "type" | "hold" | "erase";

export interface Typing {
  readonly at: number;       // which prompt
  readonly n: number;        // how many of its letters show
  readonly phase: Phase;
  readonly wait: number;     // ticks spent holding
  readonly locked: boolean;
}

export interface Pace {
  readonly hold: number;     // ticks to hold a whole prompt
  readonly erase?: number;   // letters removed per tick
}

const ERASE = 2;
const current = (state: Typing, prompts: readonly string[]) => prompts[state.at % prompts.length];

export function startTyping(prompts: readonly string[] = [], opening: { whole?: boolean } = {}): Typing {
  return opening.whole && prompts.length
    ? { at: 0, n: prompts[0].length, phase: "hold", wait: 0, locked: false }
    : { at: 0, n: 0, phase: "type", wait: 0, locked: false };
}

export function tick(state: Typing, prompts: readonly string[], pace: Pace): Typing {
  if (state.locked) return state;
  const erase = pace.erase ?? ERASE;
  switch (state.phase) {
    case "type":
      return state.n < current(state, prompts).length ? { ...state, n: state.n + 1 } : { ...state, phase: "hold", wait: 0 };
    case "hold":
      return state.wait + 1 < pace.hold
        ? { ...state, wait: state.wait + 1 }
        : { ...state, phase: "erase", n: Math.max(0, state.n - erase) };
    case "erase":
      return state.n > 0
        ? { ...state, n: Math.max(0, state.n - erase) }
        : { ...state, at: (state.at + 1) % prompts.length, phase: "type" };
  }
}

export const lock = (state: Typing, prompts: readonly string[]): Typing =>
  ({ ...state, locked: true, n: current(state, prompts).length });

export const release = (state: Typing): Typing => ({ ...state, locked: false, phase: "erase" });

export const visible = (state: Typing, prompts: readonly string[]): string => current(state, prompts).slice(0, state.n);

export const lockedPrompt = (state: Typing, prompts: readonly string[]): string | undefined =>
  state.locked ? current(state, prompts) : undefined;
