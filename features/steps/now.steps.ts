import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();
const section = (page: Page) => page.locator("#now");
const card = (page: Page, kind: string) => section(page).locator(`[data-now-card][data-kind="${kind.toLowerCase()}"]`).first();

Then("the Now shows {int} cards, the first one a {string}", async ({ page }, count: number, kind: string) => {
  await expect(section(page).locator("[data-now-card]")).toHaveCount(count);
  await expect(section(page).locator("[data-now-card]").first()).toHaveAttribute("data-kind", kind.toLowerCase());
  await expect(section(page).locator("[data-now-card]").first().locator("[data-kind-label]")).toHaveText(kind);
});

Then("the Now counts {string}", async ({ page }, text: string) => {
  await expect(section(page).locator("[data-count]")).toHaveText(text);
});

Then("the {string} card shows its title {string} and its opening words", async ({ page }, kind: string, title: string) => {
  await expect(card(page, kind).getByRole("heading", { name: title })).toBeVisible();
  await expect(card(page, kind).locator("[data-words]")).toHaveText(/\w{3,}/);
});

Then("the {string} card shows the repo {string} in the code face", async ({ page }, kind: string, name: string) => {
  const title = card(page, kind).getByRole("heading", { name });
  await expect(title).toBeAttached();
  expect(await title.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Plex Mono/);
});

Then("the {string} card shows its words with no title", async ({ page }, kind: string) => {
  await expect(card(page, kind).getByRole("heading")).toHaveCount(0);
  await expect(card(page, kind).locator("[data-words]")).not.toBeEmpty();
});

Then("the {string} card leads to {string} at {string}", async ({ page }, kind: string, label: string, url: string) => {
  const link = card(page, kind).getByRole("link", { name: label });
  await expect(link).toHaveAttribute("href", url);
  await expect(link).toHaveAttribute("target", "_blank");
});

Then("the first {string} card has no link", async ({ page }, kind: string) => {
  await expect(card(page, kind).getByRole("link")).toHaveCount(0);
});

When("I ask for the next thing in the Now", async ({ page }) => {
  await section(page).getByRole("button", { name: "Next", exact: true }).click();
});

When("I ask for the previous thing in the Now", async ({ page }) => {
  await section(page).getByRole("button", { name: "Previous", exact: true }).click();
});

Then("the {string} card is in focus", async ({ page }, kind: string) => {
  await expect(card(page, kind)).toHaveAttribute("data-focus", "");
  await expect(section(page).locator("[data-now-card][data-focus]")).toHaveCount(1);
});

When("I press {string}", async ({ page }, keyName: string) => {
  await page.keyboard.press(keyName);
});

When("I put the keyboard on the Now", async ({ page }) => {
  await section(page).locator("[data-strip]").focus();
});

Then("the bar's second section is {string}, leading to the Now", async ({ page }, name: string) => {
  const link = page.locator("header nav.sections a").nth(1);
  await expect(link).toHaveText(name);
  await expect(link).toHaveAttribute("href", "#now");
});

Then("the Now goes no further back", async ({ page }) => {
  await expect(section(page).getByRole("button", { name: "Previous", exact: true })).toBeDisabled();
});

Then("the Now goes no further on", async ({ page }) => {
  await expect(section(page).getByRole("button", { name: "Next", exact: true })).toBeDisabled();
  await expect(section(page).locator("[data-now-card]").last()).toHaveAttribute("data-focus", "");
});

When("I swipe the Now one card along", async ({ page }) => {
  await section(page).locator("[data-strip]").evaluate((strip) => {
    const [a, b] = strip.querySelectorAll<HTMLElement>("[data-now-card]");
    strip.scrollTo({ left: b.offsetLeft - a.offsetLeft });
  });
});
