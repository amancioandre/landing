import { describe, expect, it } from "vitest";
import { refreshWeekly, type Desk } from "./weekly";

// A desk that records what was done with Latest and the Now.
function desk(over: Partial<Desk> = {}) {
  const done: string[] = [];
  const base: Desk = {
    ready: async () => true,
    collectLatest: async () => ({ changed: false, failed: [], asked: 3 }),
    publishLatest: async () => { done.push("published Latest"); },
    collectNow: async () => ({ changed: false }),
    holdNow: async () => { done.push("held the Now"); },
  };
  return { desk: { ...base, ...over }, done };
}

describe("the weekly refresh on Andre's machine (ADR 0030)", () => {
  it("publishes Latest when what Andre published changed", async () => {
    const { desk: d, done } = desk({ collectLatest: async () => ({ changed: true, failed: [], asked: 3 }) });
    expect((await refreshWeekly(d)).latest).toBe("published");
    expect(done).toEqual(["published Latest"]);
  });

  it("publishes nothing when Latest is unchanged", async () => {
    const { desk: d, done } = desk();
    expect((await refreshWeekly(d)).latest).toBe("unchanged");
    expect(done).toEqual([]);
  });

  it("still publishes what it could read when one source failed", async () => {
    const { desk: d, done } = desk({ collectLatest: async () => ({ changed: true, failed: ["youtube: HTTP 500"], asked: 3 }) });
    expect(await refreshWeekly(d)).toMatchObject({ latest: "published", problems: ["youtube: HTTP 500"] });
    expect(done).toEqual(["published Latest"]);
  });

  it("calls Latest failed when no source could be read", async () => {
    const failed = ["substack: x", "youtube: y", "github: z"];
    const { desk: d } = desk({ collectLatest: async () => ({ changed: false, failed, asked: 3 }) });
    expect(await refreshWeekly(d)).toMatchObject({ latest: "failed", problems: failed });
  });

  it("never publishes the Now: a changed Now waits for Andre's review", async () => {
    const { desk: d, done } = desk({ collectNow: async () => ({ changed: true }) });
    expect((await refreshWeekly(d)).now).toBe("waiting");
    expect(done).toEqual(["held the Now"]);
  });

  it("keeps going with the Now when Latest could not be published", async () => {
    const { desk: d, done } = desk({
      collectLatest: async () => ({ changed: true, failed: [], asked: 3 }),
      publishLatest: async () => { throw new Error("push rejected"); },
      collectNow: async () => ({ changed: true }),
    });
    expect(await refreshWeekly(d)).toMatchObject({ latest: "failed", now: "waiting", problems: ["Latest: Error: push rejected"] });
    expect(done).toEqual(["held the Now"]);
  });

  it("calls the Now failed when a source of it could not be read, and holds nothing", async () => {
    const { desk: d, done } = desk({ collectNow: async () => { throw new Error("could not read buffer"); } });
    expect(await refreshWeekly(d)).toMatchObject({ now: "failed", problems: ["Now: Error: could not read buffer"] });
    expect(done).toEqual([]);
  });

  it("does nothing until the saved copy of Latest is live, so nothing reaches the site before Andre says publish", async () => {
    const { desk: d, done } = desk({ ready: async () => false, collectLatest: async () => ({ changed: true, failed: [], asked: 3 }) });
    expect(await refreshWeekly(d)).toEqual({ latest: "not yet live", now: "not yet live", problems: [] });
    expect(done).toEqual([]);
  });
});
