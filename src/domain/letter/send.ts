import { compose, type Letter, type Message } from "./letter";

export type { Message };
export type Delivery = "sent" | "failed";
export type Outcome = Delivery | "bad-email" | "not-ready";

/** The domain's port for delivering a letter; the Worker's adapter is in adapters/letter (ADR 0023). */
export interface LetterSender {
  send(message: Message): Promise<Delivery>;
}

export async function sendLetter(letter: Letter, sender: LetterSender): Promise<Outcome> {
  const composed = compose(letter);
  return composed.ok ? sender.send(composed.message) : composed.problem;
}
