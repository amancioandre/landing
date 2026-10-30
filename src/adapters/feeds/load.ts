import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { latest, type Entry } from "../../domain/latest/latest";
import { FEEDS, LATEST_COUNT } from "../../content/feeds";
import { parseSubstack, parseYouTube } from "./parse";

// LATEST_SOURCE=fixtures builds from the saved copies (scenarios), otherwise from the live feeds. Paths are from the
// project root because the build bundles this module elsewhere.
const FIXTURES = join(process.cwd(), "src/adapters/feeds/fixtures");
const fromFixtures = () => process.env.LATEST_SOURCE === "fixtures";

async function read(name: keyof typeof FEEDS): Promise<string> {
  try {
    if (fromFixtures()) return await readFile(join(FIXTURES, `${name}.xml`), "utf8");
    const res = await fetch(FEEDS[name], { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (error) {
    console.warn(`[latest] the ${name} feed could not be read; building without it (${String(error)})`);
    return "";
  }
}

let once: Promise<Entry[]> | undefined;

/** Everything Andre published, newest first, read once per build for the page and the RSS feed alike. */
export function loadLatest(): Promise<Entry[]> {
  once ??= Promise.all([read("substack"), read("youtube")])
    .then(([substack, youtube]) => latest([...parseSubstack(substack), ...parseYouTube(youtube)], LATEST_COUNT));
  return once;
}
