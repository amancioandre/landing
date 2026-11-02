// npm run refresh:weekly: run weekly by systemd on Andre's machine (ops/systemd). Refreshes Latest and pushes it when it
// changed; holds a changed Now on the branch now/weekly for his review. Works in its own worktree off origin/main.
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { refreshWeekly } from "../src/domain/weekly/weekly";
import { NOW_BRANCH, worktreeDesk } from "../src/adapters/weekly/desk";

const PLACE = process.env.WEEKLY_WORKTREE ?? join(homedir(), ".cache/andreamnc/weekly");
try { process.env.GITHUB_TOKEN ||= execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim(); } catch { /* unauthenticated is enough weekly */ }

const { latest, now, problems } = await refreshWeekly(worktreeDesk(process.cwd(), PLACE));
console.log(`[weekly] Latest: ${latest}`);
console.log(`[weekly] Now: ${now}${now === "waiting" ? ` (review with: git show ${NOW_BRANCH})` : ""}`);
for (const p of problems) console.warn(`[weekly] ${p}`);
if (latest === "failed" || now === "failed") process.exit(1);
