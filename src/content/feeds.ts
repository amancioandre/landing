// Where Andre's posts live (facts). Read at build time; a static page can't read them from the browser.
export const FEEDS = {
  substack: "https://andramnc.substack.com/feed",
  youtube: "https://www.youtube.com/feeds/videos.xml?channel_id=UCi4wKOyq4b320KZiI9zqNtA",
} as const;

export const LATEST_COUNT = 6;

// The saved copy of Latest the page is built from; the collector refreshes it (ADR 0030).
export const LATEST_FILE = "src/content/latest.json";
export const GITHUB_USER = "amancioandre";
