import { execFile } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { promisify } from "node:util";
import type { Item } from "../../domain/now/now";
import { fromBuffer, fromNote, fromRepos, mayRead, TAG, type BufferPost, type Repo } from "./parse";

// Runs on Andre's machine, never on GitHub's: the vault lives only here (ADR 0027). Reads, never writes, every source.
const run = promisify(execFile);

/** Every tagged note in the vault. Private folders are skipped before they are opened, and so are Obsidian's own. */
export async function readVault(root: string): Promise<Item[]> {
  const items: Item[] = [];
  const walk = async (dir: string): Promise<void> => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name), rel = relative(root, path);
      if (entry.name.startsWith(".") || !mayRead(rel)) continue;
      if (entry.isDirectory()) await walk(path);
      else if (entry.name.endsWith(".md")) {
        const item = fromNote(rel, await readFile(path, "utf8"), (await stat(path)).mtime.toISOString());
        if (item) items.push(item);
      }
    }
  };
  await walk(root);
  return items;
}

/** Repos with the topic, Andre's own and his organisations', through his signed-in `gh`. */
export async function readGitHub(user: string): Promise<Item[]> {
  const orgs = JSON.parse((await run("gh", ["api", "user/orgs", "--jq", "[.[].login]"])).stdout) as string[];
  const owners = [user, ...orgs].flatMap((o) => ["--owner", o]);
  const { stdout } = await run("gh", ["search", "repos", "--topic", TAG, ...owners, "--limit", "100", "--json", "name,description,url,pushedAt,isPrivate,owner"]);
  return fromRepos(JSON.parse(stdout) as Repo[]);
}

const SENT = `query Sent($org: OrganizationId!, $after: String) {
  posts(first: 50, after: $after, input: {organizationId: $org, filter: {status: [sent]}, sort: [{field: dueAt, direction: desc}]}) {
    edges { node { status sentAt channelService externalLink text tags { name } } }
    pageInfo { hasNextPage endCursor }
  }
}`;

/** Sent posts carrying Buffer's tag, newest pages first. Queries only. */
export async function readBuffer(apiKey: string, organization: string, pages = 6): Promise<Item[]> {
  const posts: BufferPost[] = [];
  let after: string | null = null;
  for (let page = 0; page < pages; page++) {
    const res = await fetch("https://api.buffer.com", {
      method: "POST", signal: AbortSignal.timeout(30_000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ query: SENT, variables: { org: organization, after } }),
    });
    const out = await res.json() as { errors?: { message: string }[]; data: { posts: { edges: { node: BufferPost }[]; pageInfo: { hasNextPage: boolean; endCursor: string } } } };
    if (out.errors?.length) throw new Error(`Buffer: ${out.errors[0].message}`);
    posts.push(...out.data.posts.edges.map((e) => e.node));
    if (!out.data.posts.pageInfo.hasNextPage) break;
    after = out.data.posts.pageInfo.endCursor;
  }
  return fromBuffer(posts);
}
