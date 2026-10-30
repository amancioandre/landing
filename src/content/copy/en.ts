import type { Copy } from "./copy";

// Andre's words, 2026-10-29 (.docs/copy/interest-lines.md, .docs/copy/write-to-me-prompts.md), grammar edits approved
// by him. Status lines approved by him the same day.
export const EN = {
  site: {
    summary: "André Amnc's hub. My way of presenting myself to the world, creatively and playfully: my interests, what I can do for you, and what I give back to nature and society.",
    more: "I hope you experience my interests as I do, through the links and content I bring to you: software engineering and the code I am working on (or playing with!), an outdoorsman's videos and articles, the novels and short stories I am creating, hunting adventures throughout British Columbia, and the hardships of entrepreneurship in the age of AI.",
    imageAlt: "The ASCII mountain range on andreamnc.com",
  },
  sections: { latest: "Latest", interests: "Interests", write: "write to me", nav: "Sections", menu: "Menu" },
  interests: {
    Engineer: {
      label: "Engineer",
      line: "Engineering has been my bread-winning activity, and I take great pleasure in it. There has hardly been a day that I didn't practice it, in software or problem solving, wherever I am.",
      alt: "Two tank cars on a rail yard, seen from above",
    },
    Outdoorsman: {
      label: "Outdoorsman",
      line: "My late-life passion, and the reason I am rediscovering my life. The wilderness has been a great friend and teacher.",
      alt: "André in a beanie and a plaid jacket, looking out over the water",
    },
    Writer: {
      label: "Writer",
      line: "Writing is a means to dig deep into my life, process my experiences, and give freedom to my thoughts. Storytelling is the vehicle of tradition.",
      alt: "A cabin in a dark forest above the water",
    },
    Hunter: {
      label: "Hunter",
      line: "It connects me with the land and with the wild, out there and in me. Being responsible for a life, and for your own sustenance, is a practice of spiritual reverence for nature.",
      alt: "André in a wide-brimmed hat and a chest pack, mountains behind him",
    },
    Entrepreneur: {
      label: "Entrepreneur",
      line: "Being my own boss has always been my dream, and also my nemesis. It is a daunting and humbling experience, and it puts some perspective on bringing value to society.",
      alt: "Looking up a concrete tower to its observation deck",
    },
  },
  links: { "Code on GitHub": "Code on GitHub", "Films on YouTube": "Films on YouTube", "Stories on Substack": "Stories on Substack" },
  range: { label: "The range: five interests", index: "Interests", photoToCome: "photo to come", lineToCome: "[a line in your words]" },
  carousel: {
    all: "All interests", previous: "Previous interest", next: "Next interest",
    strip: "Interests, one at a time; use the arrow keys", slide: "{n} of {total}: {name}", show: "Show {name}",
    carouselRole: "carousel", slideRole: "slide",
  },
  latest: { nothingYet: "[nothing published yet]" },
  letter: {
    opening: "write to me",
    message: "Your message", email: "Your email", emailPlaceholder: "Your email, so I can reply", enter: "enter",
    edit: "Edit message", another: "Another question", orWriteTo: "or write to",
    badEmail: "That email doesn't look right.",
    failed: "It didn't go through. Write to {address} instead.",
    sent: "Sent. Thank you.",
  },
  prompts: [
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
  ],
  // His question, asked of each interest in turn: "What would you ask the <hunter, writer, …>?"
  asks: {
    Engineer: "What would you ask the engineer?",
    Outdoorsman: "What would you ask the outdoorsman?",
    Writer: "What would you ask the writer?",
    Hunter: "What would you ask the hunter?",
    Entrepreneur: "What would you ask the entrepreneur?",
  },
  footer: { channels: "Channels", languages: "Languages" },
} as const satisfies Copy;
