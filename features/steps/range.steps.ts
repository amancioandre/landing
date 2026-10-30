import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();
const range = (page: Page) => page.locator("[data-range]");
const card = (page: Page) => page.locator("[data-card]");

Then("the range shows waypoints {string} to {string} inside the screen", async ({ page }, first: string, last: string) => {
  const stops = range(page).locator("[data-stop]");
  await expect(stops).toHaveCount(Number(last) - Number(first) + 1);
  const width = page.viewportSize()!.width;
  for (const stop of await stops.all()) {
    const box = (await stop.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  }
  await expect(stops.first()).toHaveText(first);
});

Then("the index lists {string}, {string}, {string}, {string} and {string}",
  async ({ page }, a: string, b: string, c: string, d: string, e: string) => {
    const index = range(page).getByRole("navigation", { name: "Interests" }).getByRole("button");
    await expect(index).toHaveText([a, b, c, d, e].map((name) => new RegExp(`${name}$`)));
  });

Then("the index sits in the upper half of the range", async ({ page }) => {
  const box = (await range(page).getByRole("navigation", { name: "Interests" }).boundingBox())!;
  expect(box.y + box.height / 2).toBeLessThan(page.viewportSize()!.height / 2);
});

When("I choose {string} in the index", async ({ page }, name: string) => {
  await range(page).getByRole("navigation", { name: "Interests" }).getByRole("button", { name: new RegExp(`${name}$`) }).click();
});

When("I choose waypoint {string}", async ({ page }, number: string) => {
  await range(page).locator("[data-stop]", { hasText: number }).click();
});

Then("the card for {string} opens with a link to {string}", async ({ page }, name: string, link: string) => {
  await expect(card(page)).toBeVisible();
  await expect(card(page).getByRole("heading", { name })).toBeVisible();
  await expect(card(page).getByRole("link", { name: new RegExp(link) })).toHaveAttribute("target", "_blank");
});

When("I click on the land away from the card", async ({ page }) => {
  const box = (await range(page).boundingBox())!;
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.2);
});

Then("no card is open", async ({ page }) => {
  await expect(card(page)).toBeHidden();
});

When("I scroll past the range", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.querySelector("[data-range]")!.getBoundingClientRect().height + 50));
});

Then("the bar is docked on paper", async ({ page }) => {
  await expect(page.getByRole("banner")).toHaveAttribute("data-docked", "");
});
