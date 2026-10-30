import { describe, expect, it } from "vitest";
import { themeCss } from "./css";

describe("themeCss", () => {
  const css = themeCss();

  it("puts the day on :root, so the page is day unless told otherwise", () => {
    expect(css).toMatch(/:root\s*\{[^}]*--paper:\s*#eeebe5;/);
  });

  it("puts the night behind data-theme=\"night\", set by the visitor's clock (ADR 0018)", () => {
    expect(css).toMatch(/\[data-theme="night"\]\s*\{[^}]*--paper:\s*#0c0c0b;/);
  });

  it("names variables in kebab case", () => {
    expect(css).toContain("--ink-2: #3a3936;");
  });
});
