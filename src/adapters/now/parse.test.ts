import { describe, expect, it } from "vitest";
import { fromNote, fromRepos, fromBuffer, mayRead, mayCarryTag } from "./parse";

const note = (front: string, body = "Back from the ridge with a shoulder to smoke.\n\nMore below.") => `---\n${front}\n---\n${body}`;

describe("a vault note reaches the Now only when Andre tagged it", () => {
  it("takes a note marked site: andreamnc, with its title and its own first words", () => {
    const item = fromNote("public/now/smoke.md", note("site: andreamnc\ntitle: Smoking the shoulder\ndate: 2026-10-20"), "2026-10-29T00:00:00Z");
    expect(item).toEqual({ kind: "note", title: "Smoking the shoulder", words: "Back from the ridge with a shoulder to smoke.", date: "2026-10-20", via: "obsidian", where: "Obsidian" });
  });

  it("takes the nested tag, in the frontmatter or in the text", () => {
    expect(fromNote("a.md", note("tags: [hunting, andreamnc/now]"), "2026-10-29")).not.toBeNull();
    expect(fromNote("a.md", note("tags:\n  - andreamnc/now"), "2026-10-29")).not.toBeNull();
    expect(fromNote("a.md", "Out on the ridge today. #andreamnc/now", "2026-10-29")).not.toBeNull();
  });

  it("leaves untagged notes alone, and a tag only mentioned in code", () => {
    expect(fromNote("a.md", note("site: leathercase"), "2026-10-29")).toBeNull();
    expect(fromNote("a.md", "To tag, write `#andreamnc/now` or `site: andreamnc`.", "2026-10-29")).toBeNull();
  });

  it("names the note by its file when it has no title, and dates it by its last change", () => {
    const item = fromNote("public/now/First snow.md", note("site: andreamnc"), "2026-10-29T08:00:00Z");
    expect(item).toMatchObject({ title: "First snow", date: "2026-10-29T08:00:00Z" });
  });

  it("is a story when Andre says so, and links out when he gives the address", () => {
    const item = fromNote("a.md", note("site: andreamnc\nkind: story\nurl: https://andramnc.substack.com/p/way-back"), "2026-10-29");
    expect(item).toMatchObject({ kind: "story", url: "https://andramnc.substack.com/p/way-back" });
  });

  it("reads the words as plain text: no headings, links or emphasis", () => {
    const item = fromNote("a.md", note("site: andreamnc", "# Smoke\n\nThe [[Recipes/brine|brine]] took **two days** and a [map](https://x.y)."), "2026-10-29");
    expect(item?.words).toBe("The brine took two days and a map.");
  });
});

describe("the private folders are never read", () => {
  it.each(["journal/2026-10-20.md", "people/x.md", "body/sleep.md", "telos/t.md", "notes/n.md", "storytelling/s.md", "public/journal/x.md"])("%s stays closed", (path) => {
    expect(mayRead(path)).toBe(false);
  });
  it("opens the rest", () => expect(mayRead("public/web/andreamnc.com.md")).toBe(true));
});

describe("a repo reaches the Now through its topic", () => {
  it("shows its name, its description, its owner and its last push", () => {
    const repos = [{ name: "creative-writer", description: "Obsidian plugin for creative writers", url: "https://github.com/amancioandre/creative-writer", pushedAt: "2026-10-15T10:00:00Z", isPrivate: false, owner: { login: "amancioandre" } }];
    expect(fromRepos(repos)).toEqual([{ kind: "code", title: "creative-writer", words: "Obsidian plugin for creative writers", date: "2026-10-15T10:00:00Z", url: "https://github.com/amancioandre/creative-writer", via: "github", where: "amancioandre" }]);
  });
  it("never shows a private repo, even tagged", () => {
    expect(fromRepos([{ name: "x", description: "", url: "u", pushedAt: "2026-10-15", isPrivate: true, owner: { login: "a" } }])).toEqual([]);
  });
});

describe("a post reaches the Now through Buffer's own tag", () => {
  const post = (tags: string[], over = {}) => ({ status: "sent", sentAt: "2026-10-22T18:00:00Z", channelService: "instagram", externalLink: "https://www.instagram.com/p/abc", text: "Back from the ridge.", tags: tags.map((name) => ({ name })), ...over });
  it("takes a sent post tagged andreamnc, with its words and its address", () => {
    expect(fromBuffer([post(["andreamnc"])])).toEqual([{ kind: "post", words: "Back from the ridge.", date: "2026-10-22T18:00:00Z", url: "https://www.instagram.com/p/abc", via: "instagram", where: "Instagram" }]);
  });
  it("leaves untagged posts, and posts not yet sent", () => {
    expect(fromBuffer([post([]), post(["andreamnc"], { status: "draft" })])).toEqual([]);
  });
});

describe("which vault changes can change the Now", () => {
  it("a note outside the private folders", () => expect(mayCarryTag("public/now/smoke.md")).toBe(true));
  it.each(["journal/2026-10-31.md", "public/web/image.png", ".obsidian/workspace.json", "public/.trash/old.md"])("not %s", (path) => {
    expect(mayCarryTag(path)).toBe(false);
  });
});
