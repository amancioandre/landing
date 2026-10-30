import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

const languages = (page: import("@playwright/test").Page) =>
  page.getByRole("contentinfo").locator("nav.languages").getByRole("link");

When("I open the page at {string}", async ({ page }, path: string) => {
  await page.goto(path);
});

Then("the footer offers {int} languages, among them {string}, {string} and {string}",
  async ({ page }, count: number, a: string, b: string, c: string) => {
    await expect(languages(page)).toHaveCount(count);
    for (const name of [a, b, c]) await expect(languages(page).filter({ hasText: name })).toHaveCount(1);
  });

Then(/^(?:"([^"]+)" is marked|the footer marks "([^"]+)") as the language I am reading$/, async ({ page }, a?: string, b?: string) => {
  await expect(languages(page).and(page.locator("[aria-current=page]"))).toHaveText(a ?? b ?? "");
});

Then("the page says it is written in {string}", async ({ page }, tag: string) => {
  await expect(page.locator("html")).toHaveAttribute("lang", tag);
});

Then("the sections are named {string}, {string} and {string}", async ({ page }, a: string, b: string, c: string) => {
  await expect(page.locator("main section > .handler .label")).toHaveText([a, b, c]);
});

Then("the page points to itself at {string}", async ({ page }, href: string) => {
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", href);
});

Then("the page lists {int} languages and a default as alternates", async ({ page }, count: number) => {
  await expect(page.locator("link[rel=alternate][hreflang]")).toHaveCount(count + 1);
  await expect(page.locator("link[rel=alternate][hreflang=x-default]")).toHaveAttribute("href", "https://andreamnc.com/");
});

// The offer reads the browser's languages; scenarios set them before the page loads.
Given("my browser prefers {string}", async ({ page }, tag: string) => {
  await page.addInitScript((t) => {
    Object.defineProperty(navigator, "languages", { get: () => [t] });
    Object.defineProperty(navigator, "language", { get: () => t });
  }, tag);
});

const offer = (page: import("@playwright/test").Page) => page.locator("[data-range] [data-offer]");

Then("the range offers {string}, leading to {string}", async ({ page }, words: string, path: string) => {
  await expect(offer(page)).toBeVisible();
  await expect(offer(page)).toContainText(words);
  await expect(offer(page)).toHaveAttribute("href", path);
});

Then("the range offers no other language", async ({ page }) => {
  await expect(offer(page)).toBeHidden();
});

When("I follow the offer", async ({ page }) => {
  await offer(page).click();
  await page.waitForLoadState();
});

When("I choose {string} among the footer's languages", async ({ page }, name: string) => {
  await page.getByRole("contentinfo").locator("nav.languages").getByRole("link", { name }).click();
  await page.waitForLoadState();
});
