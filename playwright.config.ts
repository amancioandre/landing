import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({ features: "features/*.feature", steps: "features/steps/*.ts" });

export default defineConfig({
  testDir,
  // WebGL is off in scenarios: behaviour must not depend on the drawing, and fast-forwarded time stays fast.
  // The drawing itself is checked by eye in a WebGL browser.
  use: { baseURL: "http://127.0.0.1:4322", launchOptions: { args: ["--disable-webgl", "--disable-3d-apis"] } },
  // Astro 7 backgrounds its own preview server, so the built site is served in the foreground by Python.
  webServer: { command: "LATEST_SOURCE=fixtures npm run build && python3 -m http.server 4322 --bind 127.0.0.1 --directory dist", url: "http://127.0.0.1:4322", reuseExistingServer: false, timeout: 120_000, stdout: "ignore", stderr: "ignore" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
