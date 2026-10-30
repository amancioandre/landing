// Where Andre's posts live (facts). Read at build time; a static page can't read them from the browser.
export const FEEDS = {
  substack: "https://andramnc.substack.com/feed",
  youtube: "https://www.youtube.com/feeds/videos.xml?channel_id=UCi4wKOyq4b320KZiI9zqNtA",
} as const;

export const LATEST_COUNT = 6;
