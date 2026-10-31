import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { now, type Item } from "../../domain/now/now";
import { NOW_COUNT, NOW_FILE } from "../../content/now";

// The build reads what the collect step left; NOW_SOURCE=fixtures reads the scenarios' copy instead. Paths are from the
// project root because the build bundles this module elsewhere.
const FIXTURE = join(process.cwd(), "src/adapters/now/fixtures/now.json");

let once: Promise<Item[]> | undefined;

/** What Andre tagged, newest first, read once per build; in dev, on every page load, so a new gathering shows. */
export function loadNow(): Promise<Item[]> {
  if (import.meta.env.DEV) once = undefined;
  once ??= readFile(process.env.NOW_SOURCE === "fixtures" ? FIXTURE : join(process.cwd(), NOW_FILE), "utf8")
    .then((text) => now(JSON.parse(text) as Item[], NOW_COUNT))
    .catch((error) => { console.warn(`[now] the tagged list could not be read; building without it (${String(error)})`); return []; });
  return once;
}
