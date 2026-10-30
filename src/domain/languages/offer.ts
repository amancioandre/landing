// What the range shows to offer a language: its short code, its words in that language, and where it lives.
export interface Offer {
  tag: string;
  path: string;
  code: string;    // "DE", "JA": shown like a waypoint's number
  words: string;   // "Auf Deutsch lesen"
}
