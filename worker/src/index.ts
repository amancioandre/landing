// The Worker's composition root: Cloudflare's bindings and secrets wired to the letter desk (ADR 0023).
import { EmailMessage } from "cloudflare:email";
import { receiveLetter } from "./letter-desk";
import { rawLetter } from "./mailbox";
import { turnstileCheck } from "./turnstile";

interface Env {
  LETTERS: SendEmail;          // Email Routing; may send only to verified destinations
  INBOX: string;               // secret: where hello@ forwards, kept out of the public repo
  TURNSTILE_SECRET: string;    // secret
}

const FROM = "hello@andreamnc.com";

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return receiveLetter(request, {
      isHuman: turnstileCheck(env.TURNSTILE_SECRET),
      deliver: async (mail) => {
        await env.LETTERS.send(new EmailMessage(FROM, env.INBOX, rawLetter(mail, { from: FROM, to: env.INBOX })));
      },
    });
  },
} satisfies ExportedHandler<Env>;
