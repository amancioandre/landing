// The palette approved on the canvas (ADR 0012, ADR 0015). Paper and ink swap in the dark theme;
// the red keeps its hue and is lifted to stay readable on black.
export const THEMES = {
  light: { paper: "#eeebe5", ink: "#0c0c0b", ink2: "#3a3936", mute: "#67655f", mark: "#8c8a85", signal: "#d01509" },
  dark: { paper: "#0c0c0b", ink: "#eeebe5", ink2: "#c9c5bd", mute: "#a39f97", mark: "#6b6964", signal: "#f4190b" },
} as const;

export type ThemeName = keyof typeof THEMES;
export type Role = keyof (typeof THEMES)["light"];

// Roles that carry words. "mark" is for rules and empty-frame borders only, never text.
export const TEXT_ROLES = ["ink", "ink2", "mute", "signal"] as const satisfies readonly Role[];
