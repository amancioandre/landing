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

Then("the settings start where Andre set them: fog {int}, wind {int} from the east, clouds {int}, fire {int}, smoke {int}, stars {int}, glyphs {int}, contrast {int}, mist {int}",
  async ({ page }, fog: number, wind: number, clouds: number, fire: number, smoke: number, stars: number, glyphs: number, contrast: number, mist: number) => {
    const at = { fog, wind, clouds, fire, smoke, stars, glyphSize: glyphs, contrast, mist };
    for (const [name, value] of Object.entries(at)) await expect(panel(page).locator(`input[name=${name}]`)).toHaveValue(String(value));
    await expect(panel(page).getByRole("radio", { name: "east →" })).toBeChecked();
  });

Then("the time follows the visitor's clock, the ink is Starlight and the characters are Full", async ({ page }) => {
  for (const name of ["My clock", "Starlight", "Full"]) await expect(panel(page).getByRole("radio", { name, exact: true })).toBeChecked();
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
