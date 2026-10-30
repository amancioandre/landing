// The palette approved on the canvas (ADR 0012, ADR 0015). Day is paper and ink; night (ADR 0018) is ink with
// gentler words than white (Andre: "use less white"), and the red lifted to stay readable on black.
export const THEMES = {
  day: { paper: "#eeebe5", ink: "#0c0c0b", ink2: "#3a3936", mute: "#67655f", mark: "#8c8a85", signal: "#d01509" },
  night: { paper: "#0c0c0b", ink: "#c9c5bd", ink2: "#a39f97", mute: "#8a867f", mark: "#5c5a55", signal: "#f4190b" },
} as const;

export type ThemeName = keyof typeof THEMES;
export type Role = keyof (typeof THEMES)["day"];

// Roles that carry words. "mark" is for rules and empty-frame borders only, never text.
export const TEXT_ROLES = ["ink", "ink2", "mute", "signal"] as const satisfies readonly Role[];

/** The colour the browser paints its own bar with: the paper of the hour, so bar and page read as one sheet. */
export const themeColor = (theme: ThemeName): string => THEMES[theme].paper;
