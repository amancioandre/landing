import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { now, type Item } from "../../domain/now/now";
import { NOW_COUNT, NOW_FILE } from "../../content/now";
import { readBuffer, readGitHub, readVault } from "./collect";

// The collect step (ADR 0027), shared by `npm run collect:now` and the dev server.
const home = homedir();
export const VAULT = process.env.NOW_VAULT ?? join(home, "obsidian");
const LAYERS = join(home, ".claude/skills/spokesperson/layers.json");

async function buffer() {
  const key = process.env.BUFFER_API_KEY;
  const org = process.env.BUFFER_ORGANIZATION_ID ?? JSON.parse(await readFile(LAYERS, "utf8")).buffer_organization_id;
  if (!key || !org) throw new Error("Buffer: BUFFER_API_KEY or the organization id is missing");
  return readBuffer(key, org);
}

export interface Gathered { items: Item[]; changed: boolean }

/** Reads every source and writes now.json when the list changed. If any source can't be read it throws and writes
 *  nothing: a half list would quietly drop what Andre tagged. */
export async function gatherNow(root = process.cwd()): Promise<Gathered> {
  const sources = { vault: () => readVault(VAULT), github: () => readGitHub("amancioandre"), buffer };
  const read = await Promise.allSettled(Object.values(sources).map((s) => s()));
  const failed = read.flatMap((r, i) => (r.status === "rejected" ? [`${Object.keys(sources)[i]}: ${String(r.reason)}`] : []));
  if (failed.length) throw new Error(`could not read ${failed.join("; ")}`);
  const items = now(read.flatMap((r) => (r.status === "fulfilled" ? r.value : [])), NOW_COUNT);
  const file = join(root, NOW_FILE), text = JSON.stringify(items, null, 2) + "\n";
  const before = await readFile(file, "utf8").catch(() => "");
  if (before !== text) await writeFile(file, text);
  return { items, changed: before !== text };
}
