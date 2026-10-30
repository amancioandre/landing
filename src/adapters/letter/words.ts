import type { LetterWords } from "../../domain/letter/words";

// Scripts are bundled once for every language, so the page carries its own words (rendered by the layout) and the
// letter reads them from there.
export const WORDS_ID = "letter-words";

export const readWords = (): LetterWords => JSON.parse(document.getElementById(WORDS_ID)!.textContent!);
