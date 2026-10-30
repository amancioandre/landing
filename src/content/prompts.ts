import type { Copy } from "./copy/copy";
import { INTERESTS } from "./interests";
import { interleave } from "../domain/letter/prompts";
import type { LetterWords } from "../domain/letter/words";

// His questions take turns with an ask of each interest, hunter, writer, engineer, outdoorsman, entrepreneur.
const ASKED = ["Hunter", "Writer", "Engineer", "Outdoorsman", "Entrepreneur"] as const;

export function rotationIn(copy: Copy): string[] {
  const asks = ASKED.filter((name) => INTERESTS.includes(name)).map((name) => copy.asks[name]);
  return interleave(copy.prompts, asks, 3);
}

/** What the letter's scripts need in one language: the opening, the questions in turn, and the status lines. */
export function letterWordsIn(copy: Copy): LetterWords {
  const { opening, badEmail, failed, sent } = copy.letter;
  return { opening, prompts: rotationIn(copy), badEmail, failed, sent };
}
