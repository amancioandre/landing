import { describe, expect, it } from "vitest";
import { themeCss } from "./css";

describe("themeCss", () => {
  const css = themeCss();

  it("puts the light theme on :root, so the page is light unless told otherwise", () => {
    expect(css).toMatch(/:root\s*\{[^}]*--paper:\s*#eeebe5;/);
  });

  it("puts the dark theme behind data-theme=\"dark\", ready for a switcher", () => {
    expect(css).toMatch(/\[data-theme="dark"\]\s*\{[^}]*--paper:\s*#0c0c0b;/);
  });

  it("names variables in kebab case", () => {
    expect(css).toContain("--ink-2: #3a3936;");
  });
});
