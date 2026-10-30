import { lock, release, startTyping, tick, visible, lockedPrompt, type Typing } from "../../domain/letter/typewriter";
import { LetterForm, formParts } from "./letter-form";
import { notConnected } from "./not-connected";

const TICK_MS = 45, HOLD_TICKS = 60;
export const OPENING = "write to me";   // typed first; a letter opened on it answers no particular question

/** The bar's write-to-me: types the prompts; one click locks the question and puts the caret in the letter. */
export function mountBar(root: HTMLElement, prompts: readonly string[], address: string): void {
  const ask = root.querySelector<HTMLButtonElement>("[data-ask]")!;
  const panel = root.querySelector<HTMLElement>("[data-panel]")!;
  const form = new LetterForm(formParts(panel), notConnected, address);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let typing: Typing = startTyping(prompts, { whole: true });

  const render = () => {
    ask.textContent = calm && !typing.locked ? prompts[typing.at] : visible(typing, prompts);
    ask.setAttribute("aria-expanded", String(typing.locked));
    root.classList.toggle("open", typing.locked);
    panel.hidden = !typing.locked;
  };
  const open = () => {
    if (typing.locked) return panel.querySelector<HTMLElement>("textarea:not([hidden]), input:not([hidden])")?.focus();
    const waiting = form.draftPrompt, at = waiting ? prompts.indexOf(waiting) : -1;
    typing = lock(at >= 0 ? { ...typing, at } : typing, prompts);
    render();
    const prompt = lockedPrompt(typing, prompts);
    form.begin(prompt === OPENING ? undefined : prompt);
  };
  const close = () => {
    if (!typing.locked) return;
    form.fold();
    typing = release(typing);
    render();
  };

  ask.addEventListener("click", open);
  root.querySelector("[data-again]")?.addEventListener("click", close);
  root.addEventListener("focusout", () => setTimeout(() => { if (!root.contains(document.activeElement)) close(); }));
  setInterval(() => { typing = tick(typing, prompts, { hold: calm ? Math.round(6000 / TICK_MS) : HOLD_TICKS, erase: calm ? 999 : 2 }); render(); }, TICK_MS);
  render();
}
