import { LetterForm, formParts } from "./letter-form";
import { postOffice } from "./post-office";

const TURN_MS = 6000, FADE_MS = 600;

/** The write-to-me section: prompts take turns above the letter, and hold still once someone is writing. */
export function mountSection(root: HTMLElement, prompts: readonly string[], address: string): void {
  const form = new LetterForm(formParts(root), postOffice("section"), address);
  const line = root.querySelector<HTMLElement>("[data-prompt]")!;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let at = 0;
  const showPrompt = () => { line.textContent = prompts[at]; };
  const writing = () => form.hasWords || root.contains(document.activeElement);

  showPrompt();
  root.querySelector("textarea")!.addEventListener("focus", () => form.answer(prompts[at]));
  setInterval(() => {
    if (writing()) return;
    if (calm) { at = (at + 1) % prompts.length; return showPrompt(); }
    line.classList.add("leaving");
    setTimeout(() => { at = (at + 1) % prompts.length; showPrompt(); line.classList.remove("leaving"); }, FADE_MS);
  }, TURN_MS);
}
