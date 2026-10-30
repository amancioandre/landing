import type { Copy } from "./copy";
import type { Language } from "../../domain/languages/languages";
import { EN } from "./en";

// Every language's words, by tag. English is Andre's; the others are AI translations awaiting his review.
const COPIES: Readonly<Record<string, Copy>> = {
  en: EN,
};

export function copyIn(language: Language): Copy {
  const copy = COPIES[language.tag];
  if (!copy) throw new Error(`No words for ${language.tag}`);
  return copy;
}
