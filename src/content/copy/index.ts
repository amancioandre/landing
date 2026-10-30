import type { Copy } from "./copy";
import type { Language } from "../../domain/languages/languages";
import { EN } from "./en";
import { PT_BR } from "./pt-br";
import { ES_ES } from "./es-es";
import { ES_419 } from "./es-419";
import { FR } from "./fr";
import { DE } from "./de";
import { IT } from "./it";
import { JA } from "./ja";
import { KO } from "./ko";
import { ZH_HANS } from "./zh-hans";
import { ZH_HANT } from "./zh-hant";
import { UK } from "./uk";
import { RU } from "./ru";

// Every language's words, by tag. English is Andre's; the others are AI translations awaiting his review.
export const COPIES: Readonly<Record<string, Copy>> = {
  en: EN, "pt-BR": PT_BR, "es-ES": ES_ES, "es-419": ES_419, fr: FR, de: DE, it: IT,
  ja: JA, ko: KO, "zh-Hans": ZH_HANS, "zh-Hant": ZH_HANT, uk: UK, ru: RU,
};

export function copyIn(language: Language): Copy {
  const copy = COPIES[language.tag];
  if (!copy) throw new Error(`No words for ${language.tag}`);
  return copy;
}
