import { estimatePlace, isNight, themeFor } from "../../domain/daylight/sun";
import { SOUTHERN_ZONES, ZONE_CITIES } from "../../content/zones";
import { themeColor } from "../../design/tokens";

const RECHECK_MS = 5 * 60_000;
type Sky = Parameters<typeof themeFor>[0];

/** Day or night by the visitor's own clock and place, unless they hold one in the range's settings (data-sky). */
export function showTheSky(root: HTMLElement = document.documentElement): void {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  const now = new Date();
  const place = estimatePlace(zone, now.getTimezoneOffset(), ZONE_CITIES, SOUTHERN_ZONES);
  const theme = themeFor((root.dataset.sky as Sky | undefined) ?? "clock", isNight(now, place));
  if (root.dataset.theme !== theme) root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor(theme));
}

/** Puts the page in day or night and keeps it right as the evening comes. */
export function followTheSun(root: HTMLElement = document.documentElement): void {
  showTheSky(root);
  setInterval(() => showTheSky(root), RECHECK_MS);
}
