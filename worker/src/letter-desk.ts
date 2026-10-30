// The Worker's one job (ADR 0023): take a letter from the page, make sure a person sent it, and hand it to Andre's inbox.
import { envelope, readMessage, type Envelope } from "../../src/domain/letter/delivery";

/** What the desk needs from the outside: a bot check and a way to deliver. */
export interface Desk {
  isHuman(token: string, ip: string): Promise<boolean>;
  deliver(mail: Envelope): Promise<void>;
}

const answer = (status: number, body: object) => Response.json(body, { status, headers: { "cache-control": "no-store" } });

async function bodyOf(request: Request): Promise<unknown> {
  try { return await request.json(); } catch { return undefined; }
}

export async function receiveLetter(request: Request, desk: Desk): Promise<Response> {
  if (request.method !== "POST") return answer(405, { problem: "post-only" });
  const body = await bodyOf(request);
  if (body === undefined) return answer(400, { problem: "malformed" });
  const arrival = readMessage(body);
  if (!arrival.ok) return answer(422, { problem: arrival.problem });

  const token = (body as { token?: unknown }).token;
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  if (typeof token !== "string" || !(await desk.isHuman(token, ip))) return answer(403, { problem: "not-human" });

  try {
    await desk.deliver(envelope(arrival.message));
  } catch {
    return answer(502, { problem: "not-delivered" });
  }
  return answer(200, { sent: true });
}
