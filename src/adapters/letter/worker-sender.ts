import type { Visit } from "../../domain/letter/delivery";
import type { LetterSender } from "../../domain/letter/send";

/** Posts the letter, a note about the visit, and a pass that a person wrote it, to the Worker (ADR 0023, 0024). */
export function workerSender(endpoint: string, pass: () => Promise<string | null>, visit: () => Visit, sent: (visit: Visit) => void = () => {}): LetterSender {
  return {
    async send(message) {
      try {
        const token = await pass();
        if (!token) return "failed";
        const about = visit();
        const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...message, visit: about, token }) });
        if (!res.ok) return "failed";
        sent(about);
        return "sent";
      } catch {
        return "failed";
      }
    },
  };
}
