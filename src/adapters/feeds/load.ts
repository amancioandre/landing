import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { everything, latest, type Entry, type Snapshot } from "../../domain/latest/latest";
import { LATEST_COUNT, LATEST_FILE } from "../../content/feeds";
import { parseRepos, parseSubstack, parseYouTube } from "./parse";

// The page is built from the saved copy the collector keeps (ADR 0030), never from the network, so a feed that is down
// at build time can't empty Latest. LATEST_SOURCE=fixtures builds from the saved feeds the scenarios know instead.
// Paths are from the project root because the build bundles this module elsewhere.
const FIXTURES = join(process.cwd(), "src/adapters/feeds/fixtures");
const fixture = (name: string) => readFile(join(FIXTURES, name), "utf8");

async function snapshot(): Promise<Snapshot> {
  if (process.env.LATEST_SOURCE === "fixtures") {
    const [substack, youtube, github] = await Promise.all([fixture("substack.xml"), fixture("youtube.xml"), fixture("github.json")]);
    return { substack: parseSubstack(substack), youtube: parseYouTube(youtube), github: parseRepos(github) };
  }
  try {
    return JSON.parse(await readFile(join(process.cwd(), LATEST_FILE), "utf8")) as Snapshot;
  } catch (error) {
    console.warn(`[latest] ${LATEST_FILE} could not be read; building without Latest (${String(error)})`);
    return { substack: [], youtube: [], github: [] };
  }
}

let once: Promise<Entry[]> | undefined;

/** Everything Andre published, newest first, read once per build for the page and the RSS feed alike. */
export function loadLatest(): Promise<Entry[]> {
  once ??= snapshot().then((s) => latest(everything(s), LATEST_COUNT));
  return once;
}
