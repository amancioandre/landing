import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();
const section = (page: Page) => page.locator("#interests");
const card = (page: Page, name: string) => section(page).locator(`[data-slide="${name}"]`);

Then("{string} is the interest in focus", async ({ page }, name: string) => {
  await expect(card(page, name)).toHaveAttribute("data-focus", "");
  await expect(section(page).locator("[data-slide][data-focus]")).toHaveCount(1);
});

Then("its photo shows", async ({ page }) => {
  const focused = section(page).locator("[data-slide][data-focus]");
  await expect(focused.locator("img")).toHaveCSS("opacity", "1");
});

Then("the card for {string} shows its photo drawn in glyphs", async ({ page }, name: string) => {
  await expect(card(page, name).locator("canvas")).toBeVisible();
  await expect(card(page, name).locator("img")).toHaveCSS("opacity", "0");
});

When("I choose {string} among the interests", async ({ page }, name: string) => {
  await section(page).getByRole("navigation", { name: "All interests" }).getByRole("button", { name: new RegExp(name) }).click();
});

When("I ask for the next interest", async ({ page }) => {
  await section(page).getByRole("button", { name: "Next interest" }).click();
});

When("I ask for the previous interest", async ({ page }) => {
  await section(page).getByRole("button", { name: "Previous interest" }).click();
});

Then("the card for {string} is still in view to the left, out of focus", async ({ page }, name: string) => {
  const slide = card(page, name), focused = section(page).locator("[data-slide][data-focus]");
  await expect(slide).not.toHaveAttribute("data-focus", "");
  await page.waitForTimeout(900);   // let the strip finish moving
  const box = (await slide.locator(".figure").boundingBox())!, now = (await focused.locator(".figure").boundingBox())!;
  expect(box.x).toBeLessThan(now.x);
  // What is actually drawn at the visible middle of its leftover part must be that card, not something clipping it.
  const left = Math.max(box.x, 0), x = left + (box.x + box.width - left) / 2, y = box.y + box.height / 2;
  expect(box.x + box.width).toBeGreaterThan(8);
  const hit = await page.evaluate(([px, py, label]) => !!document.elementFromPoint(px, py)?.closest(`[data-slide="${label}"]`), [x, y, name] as const);
  expect(hit).toBe(true);
});

When("I put the keyboard on the interests", async ({ page }) => {
  await section(page).locator("[data-track]").focus();
});

When("I press {string}", async ({ page }, keyName: string) => {
  await page.keyboard.press(keyName);
});

Then("the links of {string} cannot be reached yet", async ({ page }, name: string) => {
  await expect(card(page, name).locator("[data-body]")).toHaveAttribute("inert", "");
});

Then("the links of {string} open in a new tab", async ({ page }, name: string) => {
  for (const link of await card(page, name).getByRole("link").all()) await expect(link).toHaveAttribute("target", "_blank");
});
