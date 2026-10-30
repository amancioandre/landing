import { advance, answering, back, fold, startLetter, unfold, write, type Draft, type Letter } from "../../domain/letter/letter";
import { sendLetter, type LetterSender, type Outcome } from "../../domain/letter/send";

export interface FormParts {
  root: HTMLElement;
  note: HTMLTextAreaElement;
  from: HTMLInputElement;
  said: HTMLElement;
  status: HTMLElement;
  key: HTMLButtonElement;
  back?: HTMLButtonElement;
}

// Status lines, approved by Andre (2026-10-29).
const say = (address: string): Record<Outcome, string> => ({
  "not-ready": "",
  "bad-email": "That email doesn't look right.",
  "not-connected": `Sending isn't connected yet. Write to ${address} instead.`,
  failed: `It didn't go through. Write to ${address} instead.`,
  sent: "Sent. Thank you.",
});

/** Binds one letter's fields to the Letter domain. The section and the bar each own one. */
export class LetterForm {
  private letter: Letter = startLetter();
  private draft: Draft = null;
  private readonly lines: Record<Outcome, string>;

  constructor(private readonly parts: FormParts, private readonly sender: LetterSender, address: string) {
    this.lines = say(address);
    parts.note.addEventListener("input", () => this.update(parts.note.value));
    parts.from.addEventListener("input", () => this.update(parts.from.value));
    parts.note.addEventListener("keydown", (e) => this.onKey(e));
    parts.from.addEventListener("keydown", (e) => this.onKey(e));
    parts.key.addEventListener("click", () => this.forward());
    parts.back?.addEventListener("click", () => this.show((this.letter = back(this.letter)), true));
    this.show(this.letter, false);
  }

  get hasWords(): boolean { return this.letter.note.trim().length > 0 || this.letter.step === "email"; }
  get prompt(): string | undefined { return this.letter.prompt; }
  /** The question a waiting draft answers, so the bar can show it again. */
  get draftPrompt(): string | undefined { return this.draft?.prompt; }

  /** Opens the letter where the writer left it, or fresh on this prompt. */
  begin(prompt?: string): void {
    this.letter = unfold(this.draft, prompt);
    this.draft = null;
    this.show(this.letter, true);
  }

  answer(prompt: string): void { this.letter = answering(this.letter, prompt); }

  /** Puts the letter away; its words wait as a draft. */
  fold(): void {
    this.draft = fold(this.letter);
    this.letter = startLetter();
    this.parts.status.textContent = "";
    this.show(this.letter, false);
  }

  private update(text: string): void {
    this.letter = write(this.letter, text);
    this.parts.status.textContent = "";
    this.parts.root.classList.toggle("ready", (this.letter.step === "say" ? this.letter.note : this.letter.from).trim().length > 0);
  }

  private onKey(e: KeyboardEvent): void {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    this.forward();
  }

  private async forward(): Promise<void> {
    if (this.letter.step === "say") return this.show((this.letter = advance(this.letter)), true);
    const outcome = await sendLetter(this.letter, this.sender);
    this.parts.status.textContent = this.lines[outcome];
    if (outcome === "sent") this.show((this.letter = startLetter()), false);
  }

  private show(letter: Letter, focus: boolean): void {
    const { root, note, from, said, back: backButton } = this.parts;
    const asking = letter.step === "email";
    root.dataset.step = letter.step;
    note.hidden = asking; from.hidden = !asking; said.hidden = !asking;
    if (backButton) backButton.hidden = !asking;
    note.value = letter.note; from.value = letter.from; said.textContent = letter.note.trim();
    this.update(asking ? letter.from : letter.note);
    if (focus) (asking ? from : note).focus();
  }
}

export function formParts(root: HTMLElement): FormParts {
  const pick = <T extends Element>(sel: string) => root.querySelector<T>(sel) as T;
  return {
    root, note: pick("textarea"), from: pick("input[type=email]"), said: pick("[data-said]"),
    status: pick("[role=status]"), key: pick("[data-key]"), back: pick("[data-back]") ?? undefined,
  };
}
