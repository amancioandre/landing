import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();
let body = "";
const SUMMARY = "André Amnc's hub. My way of presenting myself to the world, creatively and playfully: my interests, what I can do for you, and what I give back to nature and society.";

Then("the carousel card for {string} reads {string}", async ({ page }, name: string, line: string) => {
  await expect(page.locator(`#interests [data-slide="${name}"] .line`)).toContainText(line);
});

Then("the range card for {string} reads {string}", async ({ page }, name: string, line: string) => {
  await expect(page.locator(`[data-range] [data-card-for="${name}"] .say`)).toContainText(line);
});

Then("below the range the page opens with {string}", async ({ page }, words: string) => {
  await expect(page.locator("main > :first-child")).toContainText(words);
});

Then("the page's description is the first two sentences of Andre's paragraph", async ({ page }) => {
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", SUMMARY);
});

Then("link previews carry his name, that description and a picture", async ({ page }) => {
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "André Amnc");
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", SUMMARY);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/andreamnc\.com\/.+\.(png|jpg)$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
});

Then("the page names its one address, {word}", async ({ page }, url: string) => {
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", url);
});

const graph = async (page: import("@playwright/test").Page) => {
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  return JSON.parse(raw ?? "{}")["@graph"] as Array<Record<string, unknown>>;
};
const person = async (page: import("@playwright/test").Page) => (await graph(page)).find((n) => n["@type"] === "Person")!;

Then("the structured data describes a person named {string}", async ({ page }, name: string) => {
  expect((await person(page)).name).toBe(name);
});

Then("it links his channels {string}, {string} and {string}", async ({ page }, a: string, b: string, c: string) => {
  expect((await person(page)).sameAs).toEqual(expect.arrayContaining([a, b, c]));
});

Then("it lists what he knows about, including {string}", async ({ page }, topic: string) => {
  expect((await person(page)).knowsAbout).toContain(topic);
});

Then("the page's one main heading is {string}", async ({ page }, name: string) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
});

When("I read {string}", async ({ request }, path: string) => {
  const res = await request.get(path);
  expect(res.ok()).toBe(true);
  body = await res.text();
});

Then("it allows every crawler and points to {string}", async ({}, sitemap: string) => {
  expect(body).toMatch(/User-agent: \*\s+Allow: \//);
  expect(body).not.toMatch(/Disallow: \/\s*$/m);
  expect(body).toContain(`Sitemap: ${sitemap}`);
});

Then("it lists {string}", async ({}, url: string) => {
  expect(body).toContain(`<loc>${url}</loc>`);
});

Then("it starts with {string}", async ({}, start: string) => {
  expect(body.startsWith(start)).toBe(true);
});

Then("it mentions {string}", async ({}, words: string) => {
  expect(body).toContain(words);
});


Then("the section names {string} and {string} carry no draft mark", async ({ page }, a: string, b: string) => {
  for (const name of [a, b]) {
    await expect(page.locator("main section > .handler", { hasText: name }).locator(".draft")).toHaveCount(0);
    await expect(page.getByRole("banner").locator(".draft", { hasText: name })).toHaveCount(0);
  }
});

Then("no carousel card shows a placeholder piece", async ({ page }) => {
  await expect(page.locator("#interests .piece")).toHaveCount(0);
});

const umami = (page: Page) => page.locator('head script[src="https://cloud.umami.is/script.js"]');

Then("the page loads Umami for the website {string}", async ({ page }, id: string) => {
  await expect(umami(page)).toHaveAttribute("data-website-id", id);
  await expect(umami(page)).toHaveAttribute("defer", "");
});

Then("Umami counts visits only on {string}", async ({ page }, domain: string) => {
  await expect(umami(page)).toHaveAttribute("data-domains", domain);
});
