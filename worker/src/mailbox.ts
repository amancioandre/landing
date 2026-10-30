import { createMimeMessage, Mailbox } from "mimetext";
import type { Envelope } from "../../src/domain/letter/delivery";

const base64 = (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text)));

export interface Addresses { from: string; to: string }

/** The letter as a raw email: sent from Andre's domain, answered straight back to the writer. */
export function rawLetter(mail: Envelope, { from, to }: Addresses): string {
  const msg = createMimeMessage();
  msg.setSender({ name: "andreamnc.com", addr: from });
  msg.setRecipient(to);
  msg.setHeader("Reply-To", new Mailbox(mail.replyTo));
  msg.setSubject(mail.subject);
  msg.addMessage({ contentType: "text/plain", data: base64(mail.text), encoding: "base64" });   // accents survive every mail server
  return msg.asRaw();
}
