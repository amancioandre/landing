import { RAMPS } from "./elevation";

// The range's settings (canvas row 21, A): what a visitor may turn in the small panel at the range's lower right.
// Every amount runs from 0 to 1 and sits at 0.5 as the range is drawn today; the drawing reads it as none to twice
// today's. Night ink colours are row 7's, as Andre compared them on the prototype (ADR 0018).
export type WindFrom = "west" | "east";
export type Sky = "clock" | "day" | "night";
export type NightInk = "moonlight" | "starlight" | "faint";
export type Characters = "as drawn" | "full" | "round";

export interface RangeSettings {
  fog: number; wind: number; windFrom: WindFrom; clouds: number; time: Sky;
  fire: number; smoke: number;                      // the campfire in the nook
  nightInk: NightInk; stars: number;
  glyphSize: number; characters: Characters; contrast: number; mist: number;
}
export type Amount = { [K in keyof RangeSettings]: RangeSettings[K] extends number ? K : never }[keyof RangeSettings];

export const AS_DRAWN: RangeSettings = {
  fog: 0.5, wind: 0.5, windFrom: "west", clouds: 0.5, time: "clock", fire: 0.5, smoke: 0.5,
  nightInk: "starlight", stars: 0.5, glyphSize: 0.5, characters: "as drawn", contrast: 0.5, mist: 0.5,
};

export const NIGHT_INKS: Record<NightInk, readonly [number, number, number]> = {
  moonlight: [0.64, 0.62, 0.59], starlight: [0.66, 0.64, 0.6], faint: [0.42, 0.41, 0.39],
};

const AMOUNTS = new Set<keyof RangeSettings>(["fog", "wind", "clouds", "fire", "smoke", "stars", "glyphSize", "contrast", "mist"]);
const clamp = (v: number, fallback: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : fallback);

/** The settings with one changed; amounts stay between none and full. */
export function withSetting<K extends keyof RangeSettings>(s: RangeSettings, key: K, value: RangeSettings[K]): RangeSettings {
  const v = AMOUNTS.has(key) ? clamp(value as number, s[key] as number) : value;
  return { ...s, [key]: v };
}

/** What the drawing multiplies its own constants by: 1 is today's look. */
export interface Look {
  fog: number; wind: number; windDirection: 1 | -1; clouds: number; fire: number; smoke: number;
  ink: readonly [number, number, number]; nearLift: boolean; stars: number; contrast: number; mist: number;
}

const times = (amount: number) => amount * 2;

export function lookOf(s: RangeSettings): Look {
  return {
    fog: times(s.fog), wind: times(s.wind), windDirection: s.windFrom === "west" ? 1 : -1, clouds: times(s.clouds),
    fire: times(s.fire), smoke: times(s.smoke), ink: NIGHT_INKS[s.nightInk], nearLift: s.nightInk === "starlight",
    stars: times(s.stars), contrast: times(s.contrast), mist: times(s.mist),
  };
}

/** A glyph cell from the elevation's own: 0.6× at the smallest, 1.5× at the largest. */
export const cellFor = (base: number, size: number) => base * (size < 0.5 ? 0.6 + 0.8 * size : 1 + (size - 0.5));

/** The characters to draw with: the elevation's own, or the set chosen. */
export const rampOf = (characters: Characters, own: string) => (characters === "as drawn" ? own : RAMPS[characters]);
