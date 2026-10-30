import { join } from "node:path";
import { build } from "rolldown";

let once: Promise<string> | undefined;

/**
 * The day/night check bundled into one small script for the page head, at build time. Bundling keeps the sun's
 * logic in one tested place (domain/daylight) instead of a hand-copied inline version. Paths are from the project
 * root because the build bundles this module elsewhere.
 */
export function earlyScript(): Promise<string> {
  once ??= build({
    input: join(process.cwd(), "src/adapters/daylight/early.ts"),
    write: false,
    output: { format: "iife", minify: true },
  }).then((out) => out.output[0].code);
  return once;
}
