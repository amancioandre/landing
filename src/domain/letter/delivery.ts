// The letter's far side (ADR 0023): what the Worker accepts, and how it reads in Andre's inbox.
import { compose, type Message } from "./letter";

export const MAX_NOTE = 5000;
const MAX_FIELD = 200;
const SUBJECT_LENGTH = 50;

export type Arrival = { ok: true; message: Message } | { ok: false; problem: "not-ready" | "bad-email" | "too-long" | "malformed" };

/** What the page knows about the visit the letter came from (ADR 0024). */
export interface Visit {
  readonly via?: "bar" | "section";
  readonly from?: string;          // the page they arrived from
  readonly campaign?: string;      // utm source / medium / campaign
  readonly interest?: string;      // the last interest they looked at
  readonly device?: "phone" | "tablet" | "computer";
  readonly sky?: "day" | "night";
}

/** Where the writer is, as Cloudflare places their connection. */
export interface Place { readonly city?: string; readonly region?: string; readonly country?: string; readonly timeZone?: string }

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

const oneOf = <T extends string>(value: unknown, allowed: readonly T[]) => (allowed as readonly unknown[]).includes(value) ? (value as T) : undefined;
const short = (value: unknown) => (isText(value) && value.trim() ? value.trim().slice(0, MAX_FIELD) : undefined);
const known = <T extends object>(fields: T) => Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined)) as T;

/** Keeps only what it knows how to read: a visit note is never trusted beyond its shape. */
export function readVisit(input: unknown): Visit {
  if (typeof input !== "object" || input === null) return {};
  const v = input as Record<string, unknown>;
  return known({
    via: oneOf(v.via, ["bar", "section"] as const),
    from: short(v.from),
    campaign: short(v.campaign),
    interest: short(v.interest),
    device: oneOf(v.device, ["phone", "tablet", "computer"] as const),
    sky: oneOf(v.sky, ["day", "night"] as const),
  });
}

function firstWords(note: string): string {
  const line = note.replace(/\s+/g, " ").trim();
  if (line.length <= SUBJECT_LENGTH) return line;
  const cut = line.slice(0, SUBJECT_LENGTH + 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:]+$/, "")}…`;
}

const hostOf = (url: string) => { try { return new URL(url).host; } catch { return url; } };

function theirTime(place: Place, now: Date): string | undefined {
  if (!place.timeZone) return undefined;
  try {
    return `${new Intl.DateTimeFormat("en-US", { timeZone: place.timeZone, weekday: "short", hour: "numeric", minute: "2-digit" }).format(now)} their time`;
  } catch {
    return undefined;
  }
}

// Labels are Claude's (ADR 0024), for Andre to change.
function aboutTheVisit(visit: Visit, place: Place, now: Date): string[] {
  const where = [place.city, place.region, place.country].filter(Boolean).join(", ");
  const when = theirTime(place, now);
  const on = [visit.device && `On a ${visit.device}`, visit.sky && (visit.sky === "day" ? "by day" : "at night")].filter(Boolean).join(", ");
  return [
    visit.via && `Written in ${visit.via === "bar" ? "the bar at the top" : "the write to me section"}`,
    (visit.from || visit.campaign) && `Came from ${[visit.from && hostOf(visit.from), visit.campaign && `(${visit.campaign})`].filter(Boolean).join(" ")}`,
    visit.interest && `Looking at ${visit.interest}`,
    (where || when) && [where, when].filter(Boolean).join(", "),
    on && on.charAt(0).toUpperCase() + on.slice(1),
  ].filter((line): line is string => Boolean(line));
}

/** The question on top, the words, and what is known about the visit underneath. */
export function envelope({ prompt, note, from }: Message, visit: Visit = {}, place: Place = {}, now = new Date()): Envelope {
  const asked = prompt === undefined ? "" : `${prompt}\n\n`;
  const about = aboutTheVisit(visit, place, now);
  const footer = about.length ? `\n—\n${about.join("\n")}\n` : "";
  return { replyTo: from, subject: prompt ?? firstWords(note), text: `${asked}${note}\n${footer}` };
}
