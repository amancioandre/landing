import type { Visit } from "../../domain/letter/delivery";
import { LETTER_SERVICE } from "../../content/letter";
import { turnstilePass } from "./turnstile";
import { noticeVisit } from "./visit";
import { workerSender } from "./worker-sender";

declare global { interface Window { umami?: { track(event: string, data?: object): void } } }

// One Turnstile widget and one visit for both letters (the bar's and the section's); each says where it was written.
const pass = turnstilePass(LETTER_SERVICE.turnstileSiteKey);
const visit = noticeVisit();
const counted = (about: Visit) => window.umami?.track("letter-sent", { via: about.via, interest: about.interest });

export const postOffice = (via: NonNullable<Visit["via"]>) => workerSender(LETTER_SERVICE.endpoint, pass, () => visit(via), counted);
