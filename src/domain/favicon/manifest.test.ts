import { describe, expect, it } from "vitest";
import { webManifest } from "./manifest";
import { ICON_DAY } from "./svg";

describe("the manifest a phone reads when the page is saved to its home screen", () => {
  const manifest = webManifest("André Amnc");

  it("carries his name and opens the page in the browser, as a page", () => {
    expect(manifest).toMatchObject({ name: "André Amnc", short_name: "André Amnc", start_url: "/", display: "browser" });
  });

  it("starts on the day's paper", () => {
    expect(manifest).toMatchObject({ background_color: ICON_DAY.paper, theme_color: ICON_DAY.paper });
  });

  it("offers the peak at 192 and 512, and one drawn inside the safe zone for round masks", () => {
    expect(manifest.icons).toEqual([
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ]);
  });
});
