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
