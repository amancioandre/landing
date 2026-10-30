import { THEMES, type ThemeName } from "./tokens";

const kebab = (name: string) => name.replace(/([a-z])([0-9A-Z])/g, "$1-$2").toLowerCase();

function block(selector: string, theme: ThemeName): string {
  const vars = Object.entries(THEMES[theme]).map(([role, value]) => `  --${kebab(role)}: ${value};`);
  return `${selector} {\n${vars.join("\n")}\n}`;
}

// Day is the default; night applies wherever an ancestor carries data-theme="night" (set by the visitor's clock).
export function themeCss(): string {
  return [block(":root", "day"), block('[data-theme="night"]', "night")].join("\n");
}
