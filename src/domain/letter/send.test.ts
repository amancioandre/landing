import { describe, expect, it } from "vitest";
import { advance, startLetter, write } from "./letter";
import { sendLetter, type LetterSender, type Message } from "./send";

const ready = (from: string) => write(advance(write(startLetter("Hello!"), "Hi André")), from);
const sender = (answer: "sent" | "failed") => {
  const sent: Message[] = [];
  const port: LetterSender = { send: async (m) => (sent.push(m), answer) };
  return { port, sent };
};

describe("sending a letter", () => {
  it("hands the composed message, prompt included, to the sender", async () => {
    const { port, sent } = sender("sent");
    expect(await sendLetter(ready("me@example.com"), port)).toBe("sent");
    expect(sent).toEqual([{ prompt: "Hello!", note: "Hi André", from: "me@example.com" }]);
  });

  it("never reaches the sender with a bad address", async () => {
    const { port, sent } = sender("sent");
    expect(await sendLetter(ready("nope"), port)).toBe("bad-email");
    expect(sent).toEqual([]);
  });

  it("reports what the sender says when it cannot deliver", async () => {
    expect(await sendLetter(ready("me@example.com"), sender("failed").port)).toBe("failed");
  });
});
