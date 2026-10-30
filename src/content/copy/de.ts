import type { Copy } from "./copy";

// AI translation of en.ts (2026-10-29), awaiting Andre's review.
export const DE: Copy = {
  site: {
    summary: "André Amncs Hub. Meine Art, mich der Welt vorzustellen, kreativ und verspielt: meine Interessen, was ich für dich tun kann und was ich der Natur und der Gesellschaft zurückgebe.",
    more: "Ich hoffe, du erlebst meine Interessen so wie ich, durch die Links und Inhalte, die ich dir bringe: Softwareentwicklung und der Code, an dem ich arbeite (oder mit dem ich spiele!), Videos und Artikel eines Naturmenschen, die Romane und Kurzgeschichten, die ich schreibe, Jagdabenteuer quer durch British Columbia und die Mühen des Unternehmertums im Zeitalter der KI.",
    imageAlt: "Die ASCII-Bergkette auf andreamnc.com",
  },
  sections: { latest: "Neu", interests: "Interessen", write: "schreib mir", nav: "Bereiche", menu: "Menü" },
  interests: {
    Engineer: {
      label: "Ingenieur",
      line: "Ingenieurarbeit ist mein Broterwerb, und sie macht mir große Freude. Es gab kaum einen Tag, an dem ich sie nicht ausgeübt habe, in Software oder beim Lösen von Problemen, wo immer ich bin.",
      alt: "Zwei Kesselwagen auf einem Rangierbahnhof, von oben gesehen",
    },
    Outdoorsman: {
      label: "Naturmensch",
      line: "Meine späte Leidenschaft und der Grund, warum ich mein Leben neu entdecke. Die Wildnis war mir eine große Freundin und Lehrerin.",
      alt: "André mit Mütze und karierter Jacke, der über das Wasser blickt",
    },
    Writer: {
      label: "Schriftsteller",
      line: "Schreiben ist für mich ein Weg, tief in mein Leben zu graben, meine Erfahrungen zu verarbeiten und meinen Gedanken Freiheit zu geben. Geschichtenerzählen ist das Fahrzeug der Tradition.",
      alt: "Eine Hütte in einem dunklen Wald über dem Wasser",
    },
    Hunter: {
      label: "Jäger",
      line: "Die Jagd verbindet mich mit dem Land und mit dem Wilden, da draußen und in mir. Verantwortung für ein Leben zu tragen, und für den eigenen Lebensunterhalt, ist eine Übung in spiritueller Ehrfurcht vor der Natur.",
      alt: "André mit breitkrempigem Hut und Brusttasche, Berge hinter ihm",
    },
    Entrepreneur: {
      label: "Unternehmer",
      line: "Mein eigener Chef zu sein, war immer mein Traum und zugleich meine Nemesis. Es ist eine einschüchternde und demütigende Erfahrung, und sie rückt in Perspektive, was es heißt, der Gesellschaft Wert zu bringen.",
      alt: "Blick an einem Betonturm hinauf zu seiner Aussichtsplattform",
    },
  },
  links: { "Code on GitHub": "Code auf GitHub", "Films on YouTube": "Filme auf YouTube", "Stories on Substack": "Geschichten auf Substack" },
  range: { label: "Die Bergkette: fünf Interessen", index: "Interessen", photoToCome: "Foto folgt", lineToCome: "[ein Satz in deinen Worten]" },
  carousel: {
    all: "Alle Interessen", previous: "Vorheriges Interesse", next: "Nächstes Interesse",
    strip: "Interessen, eins nach dem anderen; nutze die Pfeiltasten", slide: "{n} von {total}: {name}", show: "{name} zeigen",
    carouselRole: "Karussell", slideRole: "Folie",
  },
  latest: { nothingYet: "[noch nichts veröffentlicht]" },
  letter: {
    opening: "schreib mir",
    message: "Deine Nachricht", email: "Deine E-Mail", emailPlaceholder: "Deine E-Mail, damit ich antworten kann", enter: "Enter",
    edit: "Nachricht bearbeiten", another: "Andere Frage", orWriteTo: "oder schreib an",
    badEmail: "Diese E-Mail sieht nicht richtig aus.",
    failed: "Das hat nicht geklappt. Schreib stattdessen an {address}.",
    sent: "Gesendet. Danke.",
  },
  prompts: [
    "Meditiere ein paar Worte",
    "Was würde dein Vorbild schreiben?",
    "Warst du heute draußen?",
    "Hast du heute den Sonnenaufgang gesehen?",
    "Schaust du auf dein Haus zurück, wenn du zur Arbeit gehst, und denkst: „Was für ein Glück ich habe“?",
    "Bist du überzeugt?",
    "Hast du dir heute einen Moment genommen, um nachzudenken, bevor du älter wirst?",
    "Lebst du in Frieden?",
    "Was hoffst du zu erreichen?",
    "Hast du je auf den Grund der Erde gestarrt?",
    "Welches Lied liebst du einfach?",
    "Erzähl mir eine Geschichte",
    "Nach Erinnerungen schürfen",
    "Hallo!",
    "Was raubt dir nachts den Schlaf?",
    "Magst du den YouTube-Kanal OutdoorBoyz auch?",
    "Brauchst du Hilfe, um zu finden, wonach du wirklich suchst?",
  ],
  asks: {
    Engineer: "Was würdest du den Ingenieur fragen?",
    Outdoorsman: "Was würdest du den Naturmenschen fragen?",
    Writer: "Was würdest du den Schriftsteller fragen?",
    Hunter: "Was würdest du den Jäger fragen?",
    Entrepreneur: "Was würdest du den Unternehmer fragen?",
  },
  offer: "Auf Deutsch lesen",
  footer: { channels: "Kanäle", languages: "Sprachen" },
};
