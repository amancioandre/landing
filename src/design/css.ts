import { THEMES, type ThemeName } from "./tokens";

const kebab = (name: string) => name.replace(/([a-z])([0-9A-Z])/g, "$1-$2").toLowerCase();

function block(selector: string, theme: ThemeName): string {
  const vars = Object.entries(THEMES[theme]).map(([role, value]) => `  --${kebab(role)}: ${value};`);
  return `${selector} {\n${vars.join("\n")}\n}`;
}

// Light is the default; dark applies wherever an ancestor carries data-theme="dark".
export function themeCss(): string {
  return [block(":root", "light"), block('[data-theme="dark"]', "dark")].join("\n");
}
