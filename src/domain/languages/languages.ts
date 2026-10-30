// The languages the hub speaks (the babel tower Andre asked for). English is the original; the rest are translations.
export interface Language {
  readonly tag: string;    // BCP 47, as written in <html lang> and hreflang
  readonly name: string;   // in the language itself
}

export const LANGUAGES: readonly Language[] = [
  { tag: "en", name: "English" },
  { tag: "pt-BR", name: "Português (Brasil)" },
  { tag: "es-ES", name: "Español (España)" },
  { tag: "es-419", name: "Español (Latinoamérica)" },
  { tag: "fr", name: "Français" },
  { tag: "de", name: "Deutsch" },
  { tag: "it", name: "Italiano" },
  { tag: "ja", name: "日本語" },
  { tag: "ko", name: "한국어" },
  { tag: "zh-Hans", name: "简体中文" },
  { tag: "zh-Hant", name: "繁體中文" },
  { tag: "uk", name: "Українська" },
  { tag: "ru", name: "Русский" },
];

export const ORIGINAL = LANGUAGES[0];

/** The path segment a translation lives under: its tag in lowercase. */
export const segmentOf = (language: Language) => language.tag.toLowerCase();

export const pathFor = (language: Language) => (language === ORIGINAL ? "/" : `/${segmentOf(language)}/`);

export const languageAt = (segment: string) => LANGUAGES.find((l) => l !== ORIGINAL && segmentOf(l) === segment);

export const translations = LANGUAGES.filter((l) => l !== ORIGINAL);

/** hreflang links for every language, with the original as the default. `site` ends in a slash. */
export function alternates(site: string): { hreflang: string; href: string }[] {
  const at = (path: string) => new URL(path, site).href;
  return [...LANGUAGES.map((l) => ({ hreflang: l.tag, href: at(pathFor(l)) })), { hreflang: "x-default", href: at("/") }];
}
