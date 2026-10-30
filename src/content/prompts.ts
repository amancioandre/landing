import { INTERESTS } from "./interests";
import { interleave } from "../domain/letter/prompts";

// Andre's words, 2026-10-29 (.docs/copy/write-to-me-prompts.md). Two grammar fixes marked there.
const PROMPTS = [
  "Meditate a few words",
  "What would your role model write?",
  "Have you been outside today?",
  "Did you see the sunrise today?",
  "Do you look back at your house, when you leave for work, and think, ‘How lucky I am’?",
  "Are you convinced?",
  "Did you take a moment today to reflect before you get any older?",
  "Are you living in peace?",
  "What are you hoping to achieve?",
  "Have you ever stared at the bottom of the earth?",
  "What’s that song that you just love?",
  "Tell me a story",
  "Mining for memories",
  "Hello!",
  "What keeps you up at night?",
  "Do you like the OutdoorBoyz YouTube channel too?",
  "Do you need help to find what you are really looking for?",
];

// His question, asked of each interest in turn: "What would you ask the <hunter, writer, …>?"
const ASKS = ["Hunter", "Writer", "Engineer", "Outdoorsman", "Entrepreneur"]
  .filter((i) => (INTERESTS as readonly string[]).includes(i))
  .map((i) => `What would you ask the ${i.toLowerCase()}?`);

export const ROTATION = interleave(PROMPTS, ASKS, 3);
