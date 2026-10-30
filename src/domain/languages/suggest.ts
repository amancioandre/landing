import { LANGUAGES, type Language } from "./languages";

// Which of the hub's languages a browser tag asks for. Regions decide only where the hub has two of a language.
const TRADITIONAL = ["tw", "hk", "mo", "hant"];

function matchOf(tag: string): Language | undefined {
  const [base, ...rest] = tag.toLowerCase().split("-");
  const find = (t: string) => LANGUAGES.find((l) => l.tag === t);
  switch (base) {
    case "pt": return find("pt-BR");
    case "es": return rest.length === 0 || rest.includes("es") ? find("es-ES") : find("es-419");
    case "zh": return find(rest.some((part) => TRADITIONAL.includes(part)) ? "zh-Hant" : "zh-Hans");
    default: return find(base);
  }
}

/**
 * The language to offer a reader, from their browser's preferences in order: the first the hub speaks, if it isn't
 * the one they are reading. Nothing once they have chosen a language themselves.
 */
export function suggestion(preferred: readonly string[], reading: Language, { chosen = false } = {}): Language | undefined {
  if (chosen) return undefined;
  const wanted = preferred.map(matchOf).find(Boolean);
  return wanted === reading ? undefined : wanted;
}
