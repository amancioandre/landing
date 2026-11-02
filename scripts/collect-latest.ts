// npm run collect:latest [-- substack youtube github]: refreshes src/content/latest.json from where Andre publishes.
// A source that can't be read keeps its last entries; the run fails only when nothing could be read.
import { collectLatest } from "../src/adapters/feeds/collect";
import { LATEST_FILE } from "../src/content/feeds";
import { SOURCES, type Source } from "../src/domain/latest/latest";

const asked = process.argv.slice(2).filter((a): a is Source => (SOURCES as readonly string[]).includes(a));
const only = asked.length ? asked : SOURCES;
const { snapshot, changed, failed } = await collectLatest(process.cwd(), only);
for (const s of SOURCES) console.log(`[latest] ${s.padEnd(8)} ${snapshot[s].length} entries${failed.some((f) => f.startsWith(s)) ? " (kept: could not be read)" : ""}`);
for (const f of failed) console.warn(`[latest] ${f}`);
console.log(`[latest] ${changed ? "written to" : "unchanged in"} ${LATEST_FILE}`);
if (failed.length === only.length) process.exit(1);
