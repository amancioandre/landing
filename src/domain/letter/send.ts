import { compose, type Letter, type Message } from "./letter";

export type { Message };
export type Delivery = "sent" | "not-connected" | "failed";
export type Outcome = Delivery | "bad-email" | "not-ready";

/** The domain's port for delivering a letter. The Cloudflare Worker adapter comes later (ADR 0007). */
export interface LetterSender {
  send(message: Message): Promise<Delivery>;
}

export async function sendLetter(letter: Letter, sender: LetterSender): Promise<Outcome> {
  const composed = compose(letter);
  return composed.ok ? sender.send(composed.message) : composed.problem;
}
