import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import type { Desk } from "../../domain/weekly/weekly";
import { collectLatest } from "../feeds/collect";
import { gatherNow } from "../now/gather";
import { LATEST_FILE } from "../../content/feeds";
import { NOW_FILE } from "../../content/now";
import { SOURCES } from "../../domain/latest/latest";

const run = promisify(execFile);
const TRAILER = "\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>";
/** The branch a changed Now waits on: `git show now/weekly`, then merge it and say "publish". */
export const NOW_BRANCH = "now/weekly";

/** A desk on a copy of the live site (origin/main) in its own worktree, so Andre's checkout and his unpublished
 *  commits are never touched or pushed. */
export function worktreeDesk(repo: string, place: string): Desk {
  const git = (...args: string[]) => run("git", ["-C", place, ...args]);
  const commit = (file: string, message: string) => git("add", file).then(() => git("commit", "-q", "-m", message + TRAILER));

  return {
    async ready() {
      await run("git", ["-C", repo, "fetch", "-q", "origin", "main"]);
      const there = await access(join(place, ".git")).then(() => true, () => false);
      if (!there) await run("git", ["-C", repo, "worktree", "add", "-q", "--detach", place, "origin/main"]);
      await git("reset", "-q", "--hard", "origin/main");
      await git("clean", "-qfd");
      return access(join(place, LATEST_FILE)).then(() => true, () => false);
    },
    async collectLatest() {
      const { changed, failed } = await collectLatest(place);
      return { changed, failed, asked: SOURCES.length };
    },
    async publishLatest() {
      await commit(LATEST_FILE, "chore(latest): follow what Andre published");
      await git("push", "-q", "origin", "HEAD:main");
    },
    collectNow: () => gatherNow(place),
    async holdNow() {
      await commit(NOW_FILE, "chore(now): what Andre tagged andreamnc this week");
      await git("branch", "-f", NOW_BRANCH, "HEAD");
    },
  };
}
