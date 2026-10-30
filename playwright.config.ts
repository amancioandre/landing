import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({ features: "features/*.feature", steps: "features/steps/*.ts" });

export default defineConfig({
  testDir,
  use: { baseURL: "http://127.0.0.1:4322" },
  // Astro 7 backgrounds its own preview server, so the built site is served in the foreground by Python.
  webServer: { command: "npm run build && python3 -m http.server 4322 --bind 127.0.0.1 --directory dist", url: "http://127.0.0.1:4322", reuseExistingServer: false, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
