import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();
const section = (page: Page) => page.locator("#write");
const prompt = (page: Page) => section(page).locator("[data-prompt]");
const field = (page: Page) => section(page).locator("textarea:visible, input:visible").first();
const bar = (page: Page) => page.getByRole("banner");
const question = (page: Page) => bar(page).locator("[data-ask]");
const seen = new WeakMap<Page, string>();

Given("time is under my control", async ({ page }) => {
  await page.clock.install();
});

When("{int} seconds pass", async ({ page }, seconds: number) => {
  seen.set(page, (await prompt(page).textContent()) ?? "");
  await page.clock.runFor(seconds * 1000);
});

Then("a prompt shows above the letter", async ({ page }) => {
  await expect(prompt(page)).not.toBeEmpty();
});

Then("a different prompt shows above the letter", async ({ page }) => {
  await expect(prompt(page)).not.toHaveText(seen.get(page) ?? "");
});

When("I write {string} in the letter", async ({ page }, text: string) => {
  await field(page).fill(text);
});

Then("the same prompt still shows above the letter", async ({ page }) => {
  await expect(prompt(page)).toHaveText(seen.get(page) ?? "");
});

When("I press enter in the empty letter", async ({ page }) => {
  await field(page).press("Enter");
});

When("I press enter in the letter", async ({ page }) => {
  await field(page).press("Enter");
});

Then("the letter still asks for my message", async ({ page }) => {
  await expect(section(page).getByLabel("Your message")).toBeVisible();
});

Then("the letter asks {string}", async ({ page }, placeholder: string) => {
  await expect(section(page).getByPlaceholder(placeholder)).toBeFocused();
});

Then("the letter's keycap reads {string} beside the return glyph", async ({ page }, word: string) => {
  const keycap = section(page).locator("[data-key]");
  await expect(keycap).toHaveText(word);
  await expect(keycap.locator("svg")).toBeVisible();
});

Then("the letter does not yet ask {string}", async ({ page }, placeholder: string) => {
  await expect(section(page).getByPlaceholder(placeholder)).toBeHidden();
});

Then("my message {string} shows above it", async ({ page }, text: string) => {
  await expect(section(page).locator("[data-said]")).toHaveText(text);
});

Then("the letter says {string}", async ({ page }, text: string) => {
  await expect(section(page).getByRole("status")).toHaveText(text);
});

Then("the bar is typing a question", async ({ page }) => {
  await expect(question(page)).not.toHaveText("");
});

When("I click the question in the bar", async ({ page }) => {
  await question(page).click();
});

Then("the question in the bar stays whole", async ({ page }) => {
  const text = await question(page).textContent();
  await page.clock.runFor(5000);
  await expect(question(page)).toHaveText(text ?? "");
  await expect(question(page)).toHaveAttribute("aria-expanded", "true");
});

Then("I can type straight into the bar's letter", async ({ page }) => {
  await expect(bar(page).getByLabel("Your message")).toBeFocused();
});

When("I type {string} into the bar's letter", async ({ page }, text: string) => {
  await page.keyboard.type(text);
});

When("I click somewhere else on the page", async ({ page }) => {
  await page.locator("main").click({ position: { x: 5, y: 5 } });
  await page.clock.runFor(100);
});

Then("the bar's letter still holds {string}", async ({ page }, text: string) => {
  await expect(bar(page).getByLabel("Your message")).toHaveValue(text);
});

// Turnstile stands in with a pass, as Cloudflare's own test keys do; the Worker is played by a route.
const passingTurnstile = (page: Page) => page.route("https://challenges.cloudflare.com/**", (route) => route.fulfill({
  contentType: "text/javascript",
  body: `window.turnstile = { render: (el, o) => (window.__turnstile = o, "w"), execute: () => window.__turnstile.callback("a-person"), reset: () => {} };`,
}));
const outgoing = new WeakMap<Page, Record<string, unknown>>();
const countingUmami = (page: Page) => page.route("https://cloud.umami.is/**", (route) => route.fulfill({
  contentType: "text/javascript", body: `window.umami = { track: (name, data) => (window.__counted ??= []).push([name, data]) };`,
}));

Given("letters can be delivered", async ({ page }) => {
  await passingTurnstile(page);
  await countingUmami(page);
  await page.route("**/letter", (route) => {
    outgoing.set(page, route.request().postDataJSON());
    return route.fulfill({ status: 200, json: { sent: true } });
  });
});

Given("letters cannot be delivered right now", async ({ page }) => {
  await passingTurnstile(page);
  await page.route("**/letter", (route) => route.fulfill({ status: 502, json: { problem: "not-delivered" } }));
});

Then("the letter that went out carries {string}, {string}, its question and a pass that a person sent it", async ({ page }, note: string, from: string) => {
  const sent = outgoing.get(page);
  expect(sent).toMatchObject({ note, from, token: "a-person" });
  expect(sent?.prompt).toEqual(expect.any(String));
  const asked = await page.evaluate(() => { const o = (window as unknown as { __turnstile: { sitekey: string; action: string } }).__turnstile; return { sitekey: o.sitekey, action: o.action }; });
  expect(asked).toEqual({ sitekey: "0x4AAAAAAFsMmr_4Ql21QTux", action: "letter" });
});

Given("I arrived from {string} through a link tagged {string} and {string}", async ({ page }, from: string, source: string, medium: string) => {
  await page.goto(`/?utm_source=${source}&utm_medium=${medium}#write`, { referer: from });
});

Then("the letter that went out notes it was written in the section, on this device, under this sky", async ({ page }, ) => {
  const visit = outgoing.get(page)?.visit as Record<string, unknown>;
  const sky = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(visit).toMatchObject({ via: "section", sky });
  expect(["phone", "tablet", "computer"]).toContain(visit.device);
});

Then("the letter that went out notes I came from {string} by {string}, looking at {string}", async ({ page }, from: string, campaign: string, interest: string) => {
  expect(outgoing.get(page)?.visit).toMatchObject({ from, campaign, interest });
});

Then("Umami counts a letter sent from the section", async ({ page }) => {
  const counted = await page.evaluate(() => (window as unknown as { __counted?: unknown[] }).__counted ?? []);
  expect(counted).toContainEqual(["letter-sent", expect.objectContaining({ via: "section" })]);
});
