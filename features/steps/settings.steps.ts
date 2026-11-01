import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();

const button = (page: Page) => page.locator("[data-range]").getByRole("button", { name: "Settings" });
const panel = (page: Page) => page.locator("[data-range]").getByRole("group", { name: "Settings" });

When("I open the range's settings", async ({ page }) => {
  await button(page).click();
  await expect(panel(page)).toBeVisible();
});

Then("the settings offer {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string} and {string}",
  async ({ page }, a: string, b: string, c: string, d: string, e: string, f: string, g: string, h: string, i: string,
    j: string, k: string, l: string, m: string) => {
    for (const label of [a, b, c, d, e, f, g, h, i, j, k, l, m]) await expect(panel(page).getByText(label, { exact: true }).first()).toBeVisible();
  });

Then("every amount starts at its middle, as the range is drawn", async ({ page }) => {
  const sliders = panel(page).getByRole("slider");
  expect(await sliders.count()).toBe(9);
  for (const slider of await sliders.all()) await expect(slider).toHaveValue("50");
});

When("I choose {string} for the time", async ({ page }, sky: string) => {
  await panel(page).getByRole("radio", { name: sky, exact: true }).check({ force: true });
});

When("I press Escape", async ({ page }) => {
  await page.keyboard.press("Escape");
});

Then("the settings are closed", async ({ page }) => {
  await expect(panel(page)).toBeHidden();
  await expect(button(page)).toHaveAttribute("aria-expanded", "false");
});

Then("the strip at the foot is not covered by the settings icon", async ({ page }) => {
  await page.waitForTimeout(500);
  const box = (await button(page).boundingBox())!;
  const onTop = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest("[data-card], [data-settings-open]")?.hasAttribute("data-card"),
    [box.x + box.width / 2, box.y + box.height / 2]);
  expect(onTop, "the settings icon lies over the open card's strip").toBe(true);
});
