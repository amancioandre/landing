import { describe, expect, it } from "vitest";
import { now, showsNow, type Item } from "./now";

const note = (over: Partial<Item> = {}): Item => ({ kind: "note", title: "Smoking the shoulder", date: "2026-10-20", via: "obsidian", where: "Obsidian", ...over });

describe("the Now: what Andre tagged, newest first", () => {
  it("puts the newest first and keeps only as many as asked", () => {
    const items = [note({ date: "2026-09-01", title: "a" }), note({ date: "2026-10-01", title: "b" }), note({ date: "2026-08-01", title: "c" })];
    expect(now(items, 2).map((i) => i.title)).toEqual(["b", "a"]);
  });

  it("shows a thing once, even when two sources carry it", () => {
    const url = "https://www.instagram.com/p/abc";
    expect(now([note({ kind: "post", url }), note({ kind: "post", url, date: "2026-10-21" })], 9)).toHaveLength(1);
  });

  it("drops what has neither a title nor words, or no readable date", () => {
    expect(now([note({ title: " ", words: undefined }), note({ date: "someday" })], 9)).toEqual([]);
  });

  it("keeps a post that has only its words", () => {
    expect(now([note({ kind: "post", title: undefined, words: "Back from the ridge." })], 9)).toHaveLength(1);
  });
});

describe("the Now takes the section's place only once there is something in it", () => {
  it("waits while nothing is tagged", () => expect(showsNow([])).toBe(false));
  it("shows once one thing is tagged", () => expect(showsNow([note()])).toBe(true));
});
