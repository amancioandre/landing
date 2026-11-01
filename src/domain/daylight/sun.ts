// Day or night by where the sun is for the visitor (ADR 0018): night begins around sunset, by the season.
export interface Place { lat: number; lon: number }

const RAD = Math.PI / 180;
const SUNSET = -0.833;   // degrees: the sun's centre at the horizon, with refraction and its own radius

/** The sun's elevation above the horizon in degrees (a low-precision almanac, good to well under a degree). */
export function solarElevation(date: Date, { lat, lon }: Place): number {
  const d = date.getTime() / 86_400_000 - 10_957.5;                 // days since J2000
  const g = (357.529 + 0.98560028 * d) * RAD;                        // mean anomaly
  const q = 280.459 + 0.98564736 * d;                                // mean longitude
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD; // ecliptic longitude
  const e = (23.439 - 0.00000036 * d) * RAD;                         // obliquity
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  const gmst = (18.697374558 + 24.06570982441908 * d) * 15;          // degrees
  const hourAngle = (gmst + lon) * RAD - ra;
  return Math.asin(Math.sin(lat * RAD) * Math.sin(dec) + Math.cos(lat * RAD) * Math.cos(dec) * Math.cos(hourAngle)) / RAD;
}

export const isNight = (date: Date, place: Place) => solarElevation(date, place) < SUNSET;

/** The page's theme: the visitor's sun, unless they hold day or night in the range's settings. */
export const themeFor = (sky: "clock" | "day" | "night", sunDown: boolean): "day" | "night" =>
  sky === "clock" ? (sunDown ? "night" : "day") : sky;

/**
 * Where the visitor probably is, without asking: the time zone's own city when known; otherwise the longitude
 * the clock's offset implies, at a temperate latitude on the right side of the equator. Roughly right, never exact.
 * offsetMinutes is Date#getTimezoneOffset (positive west of Greenwich).
 */
export function estimatePlace(
  timeZone: string, offsetMinutes: number,
  known: Readonly<Record<string, readonly [number, number]>>, southern: readonly string[],
): Place {
  const city = known[timeZone];
  if (city) return { lat: city[0], lon: city[1] };
  return { lat: southern.some((prefix) => timeZone.startsWith(prefix)) ? -35 : 45, lon: -offsetMinutes / 4 };
}
