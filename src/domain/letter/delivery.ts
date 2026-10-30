// The letter's far side (ADR 0023): what the Worker accepts, and how it reads in Andre's inbox.
import { compose, type Message } from "./letter";

export const MAX_NOTE = 5000;

export type Arrival = { ok: true; message: Message } | { ok: false; problem: "not-ready" | "bad-email" | "too-long" | "malformed" };

export interface Envelope { readonly replyTo: string; readonly subject: string; readonly text: string }

const isText = (value: unknown): value is string => typeof value === "string";

/** Reads what the page sent with the same rules the page used, so both sides agree on what a letter is. */
export function readMessage(input: unknown): Arrival {
  if (typeof input !== "object" || input === null) return { ok: false, problem: "malformed" };
  const { note, from, prompt } = input as Record<string, unknown>;
  if (!isText(note) || !isText(from) || (prompt !== undefined && !isText(prompt))) return { ok: false, problem: "malformed" };
  if (note.length > MAX_NOTE) return { ok: false, problem: "too-long" };
  const composed = compose({ step: "email", note, from, ...(prompt === undefined ? {} : { prompt }) });
  return composed.ok ? composed : { ok: false, problem: composed.problem };
}

/** Wording of the delivered email is Claude's (ADR 0023), for Andre to change. */
export function envelope({ prompt, note, from }: Message): Envelope {
  const asked = prompt === undefined ? "" : `${prompt}\n\n`;
  return { replyTo: from, subject: `A letter from ${from}`, text: `${asked}${note}\n` };
}
