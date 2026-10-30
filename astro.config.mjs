import { defineConfig } from "astro/config";

// Static hub on GitHub Pages at the apex domain (ADR 0001).
export default defineConfig({
  site: "https://andreamnc.com",
  output: "static",
});
