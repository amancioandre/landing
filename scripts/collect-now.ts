// npm run collect:now: gathers what Andre tagged `andreamnc` into src/content/now.json, for him to see before "publish".
import { gatherNow } from "../src/adapters/now/gather";
import { NOW_FILE } from "../src/content/now";

try {
  const { items, changed } = await gatherNow();
  console.log(`[now] ${items.length} tagged, ${changed ? "written to" : "unchanged in"} ${NOW_FILE}${items.length ? ":" : " (the Interests carousel stays until something is tagged)"}`);
  for (const i of items) console.log(`  ${i.date.slice(0, 10)}  ${i.kind.padEnd(5)}  ${i.where.padEnd(14)}  ${i.title ?? i.words?.slice(0, 60)}`);
} catch (error) {
  console.error(`[now] not written; ${(error as Error).message}`);
  process.exit(1);
}
