import type { LetterSender } from "../../domain/letter/send";

// Until the Worker exists (ADR 0007), sending says so plainly and the address stays one click away.
export const notConnected: LetterSender = { send: async () => "not-connected" };
