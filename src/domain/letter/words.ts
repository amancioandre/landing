// The letter's words in one language, as the page hands them to its scripts.
export interface LetterWords {
  opening: string;              // the bar types it first; a letter opened on it answers no particular question
  prompts: readonly string[];   // Andre's questions and the asks, in turn
  badEmail: string;
  failed: string;               // with {address}
  sent: string;
}
