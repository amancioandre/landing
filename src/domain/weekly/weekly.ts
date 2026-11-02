// The weekly refresh on Andre's machine (Andre, 2026-11-01; ADR 0030). Latest follows what he already published, so a
// change to it goes live on its own. The Now is his to review in the diff before "publish", so it is only held for him.

/** What the refresh needs from the world: a copy of the live site to work in, the collectors, and git. */
export interface Desk {
  /** Whether the live site is built from the saved copy of Latest; before that, nothing may be pushed. */
  ready(): Promise<boolean>;
  collectLatest(): Promise<{ changed: boolean; failed: string[]; asked: number }>;
  publishLatest(): Promise<void>;
  /** Throws when any of the Now's sources can't be read: a half list would drop what Andre tagged. */
  collectNow(): Promise<{ changed: boolean }>;
  holdNow(): Promise<void>;
}

export type LatestOutcome = "published" | "unchanged" | "failed" | "not yet live";
export type NowOutcome = "waiting" | "unchanged" | "failed" | "not yet live";
export interface Refreshed { latest: LatestOutcome; now: NowOutcome; problems: string[] }

export async function refreshWeekly(desk: Desk): Promise<Refreshed> {
  if (!(await desk.ready())) return { latest: "not yet live", now: "not yet live", problems: [] };
  const problems: string[] = [];
  const latest = await refreshLatest(desk, problems);
  const now = await refreshNow(desk, problems);
  return { latest, now, problems };
}

async function refreshLatest(desk: Desk, problems: string[]): Promise<LatestOutcome> {
  try {
    const { changed, failed, asked } = await desk.collectLatest();
    problems.push(...failed);
    if (failed.length === asked) return "failed";
    if (!changed) return "unchanged";
    await desk.publishLatest();
    return "published";
  } catch (error) {
    problems.push(`Latest: ${String(error)}`);
    return "failed";
  }
}

async function refreshNow(desk: Desk, problems: string[]): Promise<NowOutcome> {
  try {
    if (!(await desk.collectNow()).changed) return "unchanged";
    await desk.holdNow();
    return "waiting";
  } catch (error) {
    problems.push(`Now: ${String(error)}`);
    return "failed";
  }
}
