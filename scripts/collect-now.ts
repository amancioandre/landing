// npm run collect:now: gathers what Andre tagged `andreamnc` into src/content/now.json, for him to see before "publish".
// If any source can't be read, nothing is written: a half list would quietly drop what he tagged.
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { now } from "../src/domain/now/now";
import { readBuffer, readGitHub, readVault } from "../src/adapters/now/collect";
import { NOW_COUNT, NOW_FILE } from "../src/content/now";

const home = homedir();
const vault = process.env.NOW_VAULT ?? join(home, "obsidian");
const layers = join(home, ".claude/skills/spokesperson/layers.json");

async function buffer() {
  const key = process.env.BUFFER_API_KEY;
  const org = process.env.BUFFER_ORGANIZATION_ID ?? JSON.parse(await readFile(layers, "utf8")).buffer_organization_id;
  if (!key || !org) throw new Error("Buffer: BUFFER_API_KEY or the organization id is missing");
  return readBuffer(key, org);
}

const sources = { vault: () => readVault(vault), github: () => readGitHub("amancioandre"), buffer };
const read = await Promise.allSettled(Object.values(sources).map((s) => s()));
const failed = read.flatMap((r, i) => (r.status === "rejected" ? [`${Object.keys(sources)[i]}: ${String(r.reason)}`] : []));
if (failed.length) {
  console.error(`[now] not written; could not read:\n  ${failed.join("\n  ")}`);
  process.exit(1);
}

const items = now(read.flatMap((r) => (r.status === "fulfilled" ? r.value : [])), NOW_COUNT);
await writeFile(join(process.cwd(), NOW_FILE), JSON.stringify(items, null, 2) + "\n");
console.log(`[now] ${items.length} tagged, written to ${NOW_FILE}${items.length ? ":" : " (the Interests carousel stays until something is tagged)"}`);
for (const i of items) console.log(`  ${i.date.slice(0, 10)}  ${i.kind.padEnd(5)}  ${i.where.padEnd(14)}  ${i.title ?? i.words?.slice(0, 60)}`);
