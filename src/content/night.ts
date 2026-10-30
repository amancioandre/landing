// The night look (ADR 0018), as Andre chose and tuned it on the prototype's sliders on 2026-10-29.
export interface NightLook {
  ink: readonly [number, number, number];   // the glyphs' colour at night, gentler than white
  nook: {
    at: readonly [number, number];          // in the original's 2000-wide frame, like the waypoints
    radius: number; glow: number; warmth: number; smoke: number; smokeHeight: number; smokeSpeed: number;
  };
}

export const NIGHT: NightLook = {
  ink: [0.66, 0.64, 0.6],                   // Starlight
  nook: { at: [764, 918], radius: 1.6, glow: 2.5, warmth: 2, smoke: 3.75, smokeHeight: 1.3, smokeSpeed: 3.5 },
};
