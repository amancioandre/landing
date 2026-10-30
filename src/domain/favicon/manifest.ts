import { ICON_DAY } from "./svg";

// What the phone shows when the page is saved to the home screen. It stays a page: no app shell, no standalone window.
export function webManifest(name: string) {
  return {
    name, short_name: name, start_url: "/", display: "browser",
    background_color: ICON_DAY.paper, theme_color: ICON_DAY.paper,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
