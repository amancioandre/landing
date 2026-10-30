import { defineConfig } from "vitest/config";

// Unit tests cover the framework-free domain only; behaviour lives in features/ (Playwright + Gherkin).
export default defineConfig({
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
