// Translations keep their blanks ({name}) wherever their grammar puts them; this fills them in.
export function fill(line: string, values: Readonly<Record<string, string | number>>): string {
  return line.replace(/\{(\w+)\}/g, (blank, key: string) => (key in values ? String(values[key]) : blank));
}
