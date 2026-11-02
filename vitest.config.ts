import { defineConfig } from "vitest/config";

// Unit tests cover the framework-free domain, the letter Worker's desk and the feed relay; behaviour lives in features/ (Playwright + Gherkin).
export default defineConfig({
  test: { include: ["src/**/*.test.ts", "worker/**/*.test.ts", "relay/**/*.test.ts"], environment: "node" },
});
