// A city per common time zone, for estimating where a visitor is without asking (latitude, longitude).
// Zones not listed fall back to the clock's offset (domain/daylight/sun.ts).
export const ZONE_CITIES: Readonly<Record<string, readonly [number, number]>> = {
  "America/Vancouver": [49.28, -123.12], "America/Edmonton": [53.55, -113.49], "America/Calgary": [51.05, -114.07],
  "America/Winnipeg": [49.9, -97.14], "America/Toronto": [43.65, -79.38], "America/Montreal": [45.5, -73.57],
  "America/Halifax": [44.65, -63.57], "America/St_Johns": [47.56, -52.71], "America/Los_Angeles": [34.05, -118.24],
  "America/Denver": [39.74, -104.99], "America/Phoenix": [33.45, -112.07], "America/Chicago": [41.88, -87.63],
  "America/New_York": [40.71, -74.0], "America/Anchorage": [61.22, -149.9], "Pacific/Honolulu": [21.31, -157.86],
  "America/Mexico_City": [19.43, -99.13], "America/Bogota": [4.71, -74.07], "America/Lima": [-12.05, -77.04],
  "America/Sao_Paulo": [-23.55, -46.63], "America/Argentina/Buenos_Aires": [-34.6, -58.38], "America/Santiago": [-33.45, -70.67],
  "Europe/London": [51.51, -0.13], "Europe/Lisbon": [38.72, -9.14], "Europe/Madrid": [40.42, -3.7], "Europe/Paris": [48.86, 2.35],
  "Europe/Berlin": [52.52, 13.4], "Europe/Rome": [41.9, 12.5], "Europe/Amsterdam": [52.37, 4.9], "Europe/Stockholm": [59.33, 18.07],
  "Europe/Oslo": [59.91, 10.75], "Europe/Helsinki": [60.17, 24.94], "Europe/Warsaw": [52.23, 21.01], "Europe/Athens": [37.98, 23.73],
  "Europe/Istanbul": [41.01, 28.98], "Europe/Moscow": [55.76, 37.62], "Africa/Cairo": [30.04, 31.24], "Africa/Lagos": [6.52, 3.38],
  "Africa/Nairobi": [-1.29, 36.82], "Africa/Johannesburg": [-26.2, 28.05], "Asia/Dubai": [25.2, 55.27], "Asia/Kolkata": [28.61, 77.21],
  "Asia/Bangkok": [13.76, 100.5], "Asia/Singapore": [1.35, 103.82], "Asia/Shanghai": [31.23, 121.47], "Asia/Hong_Kong": [22.32, 114.17],
  "Asia/Seoul": [37.57, 126.98], "Asia/Tokyo": [35.68, 139.69], "Australia/Perth": [-31.95, 115.86], "Australia/Sydney": [-33.87, 151.21],
  "Australia/Melbourne": [-37.81, 144.96], "Pacific/Auckland": [-36.85, 174.76],
};

// Zones south of the equator, by prefix, for the fallback latitude.
export const SOUTHERN_ZONES = ["Australia/", "Antarctica/", "Pacific/Auckland", "Pacific/Chatham", "America/Argentina", "America/Santiago",
  "America/Sao_Paulo", "America/Montevideo", "America/Asuncion", "America/La_Paz", "America/Lima", "Africa/Johannesburg", "Africa/Maputo",
  "Africa/Harare", "Africa/Windhoek", "Indian/"] as const;
