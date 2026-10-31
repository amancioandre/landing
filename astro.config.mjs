import { defineConfig } from "astro/config";
import { nowInDev } from "./src/adapters/now/dev";

// Static hub on GitHub Pages at the apex domain (ADR 0001). The Now gathers again as Andre tags, in dev only (ADR 0027).
export default defineConfig({
  site: "https://andreamnc.com",
  output: "static",
  integrations: [nowInDev()],
});
