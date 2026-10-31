import { watch } from "node:fs";
import { relative } from "node:path";
import type { AstroIntegration } from "astro";
import { NOW_FILE } from "../../content/now";
import { gatherNow, VAULT } from "./gather";
import { mayCarryTag } from "./parse";

// In `astro dev`, the Now follows Andre's tagging: a saved vault note gathers again at once; a saved site file does
// too, at most once a minute, since GitHub and Buffer can't tell this machine when he tags there. The page reloads only
// when the list changed. `npm run dev` gathers once before the server starts.
const SETTLE = 1_000;          // ms of quiet after a note is saved: Obsidian writes as you type
const SITE_EVERY = 60_000;     // ms between gatherings set off by the site's own files, to spare Buffer's API

export function nowInDev(): AstroIntegration {
  return {
    name: "now-in-dev",
    hooks: {
      "astro:server:setup": ({ server, logger }) => {
        let last = Date.now(), running = false, again = false, settling: ReturnType<typeof setTimeout> | undefined;
        const gather = async () => {
          if (running) { again = true; return; }
          running = true; last = Date.now();
          try {
            const { items, changed } = await gatherNow();
            if (changed) {
              logger.info(`${items.length} tagged; reloading`);
              server.ws.send({ type: "full-reload" });
            }
          } catch (error) {
            logger.warn(`not gathered, the page keeps the last list: ${(error as Error).message}`);
          } finally {
            running = false;
            if (again) { again = false; void gather(); }
          }
        };

        const vault = watch(VAULT, { recursive: true }, (_, name) => {
          if (!name || !mayCarryTag(String(name))) return;
          clearTimeout(settling);
          settling = setTimeout(gather, SETTLE);
        });
        vault.on("error", (error) => logger.warn(`the vault can't be watched: ${error.message}`));
        server.httpServer?.on("close", () => vault.close());

        server.watcher.on("change", (file) => {
          if (relative(process.cwd(), file) === NOW_FILE) return;   // its own writing must not set it off again
          if (Date.now() - last >= SITE_EVERY) void gather();
        });
      },
    },
  };
}
