import { defineConfig } from "vitest/config";

// Unit tests cover the framework-free domain and the Worker's desk; behaviour lives in features/ (Playwright + Gherkin).
export default defineConfig({
  test: { include: ["src/**/*.test.ts", "worker/**/*.test.ts"], environment: "node" },
});
