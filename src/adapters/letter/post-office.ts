import { LETTER_SERVICE } from "../../content/letter";
import { turnstilePass } from "./turnstile";
import { workerSender } from "./worker-sender";

// One sender for both letters (the bar's and the section's), so the page holds a single Turnstile widget.
export const postOffice = workerSender(LETTER_SERVICE.endpoint, turnstilePass(LETTER_SERVICE.turnstileSiteKey));
