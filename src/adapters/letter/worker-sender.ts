import type { LetterSender } from "../../domain/letter/send";

/** Posts the letter, with a pass that a person wrote it, to the Worker (ADR 0023). */
export function workerSender(endpoint: string, pass: () => Promise<string | null>): LetterSender {
  return {
    async send(message) {
      try {
        const token = await pass();
        if (!token) return "failed";
        const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...message, token }) });
        return res.ok ? "sent" : "failed";
      } catch {
        return "failed";
      }
    },
  };
}
