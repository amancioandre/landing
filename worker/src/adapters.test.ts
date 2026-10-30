import { describe, expect, it } from "vitest";
import { turnstileCheck } from "./turnstile";
import { rawLetter } from "./mailbox";

const siteverify = (answer: object, seen: FormData[] = []) =>
  (async (_url: string | URL | Request, init?: RequestInit) => (seen.push(init?.body as FormData), Response.json(answer))) as typeof fetch;

describe("Turnstile's verdict", () => {
  it("passes a person on Andre's own domain, sending the secret and the visitor's address", async () => {
    const seen: FormData[] = [];
    const isHuman = turnstileCheck("s3cret", siteverify({ success: true, hostname: "andreamnc.com" }, seen));
    expect(await isHuman("pass", "1.2.3.4")).toBe(true);
    expect(seen[0].get("secret")).toBe("s3cret");
    expect(seen[0].get("response")).toBe("pass");
    expect(seen[0].get("remoteip")).toBe("1.2.3.4");
  });

  it("turns away a failed check, and a pass issued for another site", async () => {
    expect(await turnstileCheck("s", siteverify({ success: false }))("t", "")).toBe(false);
    expect(await turnstileCheck("s", siteverify({ success: true, hostname: "elsewhere.com" }))("t", "")).toBe(false);
  });
});

describe("the email itself", () => {
  it("comes from Andre's domain, replies to the writer, and keeps every accent", () => {
    const raw = rawLetter({ replyTo: "me@example.com", subject: "A letter from me@example.com", text: "Olá, André\n" }, { from: "hello@andreamnc.com", to: "inbox@example.org" });
    expect(raw).toMatch(/^From: .*hello@andreamnc\.com/m);
    expect(raw).toMatch(/^To: .*inbox@example\.org/m);
    expect(raw).toMatch(/^Reply-To: <?me@example\.com>?/m);
    expect(raw).toMatch(/charset=UTF-8/i);
    expect(raw).not.toContain("Olá, André");   // encoded, not raw 8-bit
    expect(raw).toContain(Buffer.from("Olá, André\n").toString("base64"));
  });
});
