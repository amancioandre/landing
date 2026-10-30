import { estimatePlace, isNight } from "../../domain/daylight/sun";
import { SOUTHERN_ZONES, ZONE_CITIES } from "../../content/zones";
import { themeColor } from "../../design/tokens";

const RECHECK_MS = 5 * 60_000;

/** Puts the page in day or night by the visitor's own clock and place, and keeps it right as the evening comes. */
export function followTheSun(root: HTMLElement = document.documentElement): void {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  const set = () => {
    const now = new Date();
    const place = estimatePlace(zone, now.getTimezoneOffset(), ZONE_CITIES, SOUTHERN_ZONES);
    const theme = isNight(now, place) ? "night" : "day";
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor(theme));
  };
  set();
  setInterval(set, RECHECK_MS);
}
