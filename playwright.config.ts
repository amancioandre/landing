import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({ features: "features/*.feature", steps: "features/steps/*.ts" });

export default defineConfig({
  testDir,
  use: { baseURL: "http://localhost:4321" },
  webServer: { command: "npm run build && npm run preview -- --port 4321", url: "http://localhost:4321", reuseExistingServer: false, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
