// Andre's Umami: cookieless visit counts. It counts only on his domain, so local runs, tests and CI never add visits.
export const UMAMI = {
  script: "https://cloud.umami.is/script.js",
  websiteId: "67b02ce4-e3ee-4a99-85b7-88c6b0e1e7b2",
  domain: "andreamnc.com",
} as const;
