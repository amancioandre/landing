// The letter: say something, then say where to reply. Immutable values; every change returns a new letter.
export type Step = "say" | "email";

export interface Letter {
  readonly step: Step;
  readonly note: string;
  readonly from: string;
  readonly prompt?: string;   // the question it answers, if one was showing (ADR 0017)
}

export interface Message {
  readonly prompt?: string;
  readonly note: string;
  readonly from: string;
}

export type Composed = { ok: true; message: Message } | { ok: false; problem: "not-ready" | "bad-email" };

/** What remains of a letter folded away mid-way. Null when nothing was written. */
export type Draft = Letter | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasWords = (text: string) => text.trim().length > 0;

export function startLetter(prompt?: string): Letter {
  return prompt === undefined ? { step: "say", note: "", from: "" } : { step: "say", note: "", from: "", prompt };
}

export function write(letter: Letter, text: string): Letter {
  return letter.step === "say" ? { ...letter, note: text } : { ...letter, from: text };
}

export function advance(letter: Letter): Letter {
  return letter.step === "say" && hasWords(letter.note) ? { ...letter, step: "email" } : letter;
}

export function back(letter: Letter): Letter {
  return { ...letter, step: "say" };
}

export function fold(letter: Letter): Draft {
  return hasWords(letter.note) ? letter : null;
}

export function unfold(draft: Draft, prompt?: string): Letter {
  return draft ?? startLetter(prompt);
}

export function compose(letter: Letter): Composed {
  if (letter.step !== "email" || !hasWords(letter.note)) return { ok: false, problem: "not-ready" };
  const from = letter.from.trim();
  if (!EMAIL.test(from)) return { ok: false, problem: "bad-email" };
  const message: Message = { note: letter.note.trim(), from };
  return { ok: true, message: letter.prompt === undefined ? message : { prompt: letter.prompt, ...message } };
}
