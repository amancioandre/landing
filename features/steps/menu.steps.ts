import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();
const button = (page: Page) => page.getByRole("banner").getByRole("button", { name: "Menu" });
const menu = (page: Page) => page.getByRole("banner").getByRole("navigation", { name: "Menu" });

Given("I am on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
});

Given("I am on a wide screen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
});

When("I open the menu", async ({ page }) => {
  await button(page).click();
});

Then("the menu offers {string}, {string} and {string}", async ({ page }, a: string, b: string, c: string) => {
  await expect(menu(page)).toBeVisible();
  await expect(button(page)).toHaveAttribute("aria-expanded", "true");
  for (const name of [a, b, c]) await expect(menu(page).getByRole("link", { name: new RegExp(`${name}$`) })).toBeVisible();
});

Then("the menu lists the five interests with their numbers", async ({ page }) => {
  const interests = menu(page).getByRole("list", { name: "Interests" }).getByRole("link");
  await expect(interests).toHaveText(["01Engineer", "02Outdoorsman", "03Writer", "04Hunter", "05Entrepreneur"]);
});

Then("the menu links to {string} and to {string}", async ({ page }, channel: string, address: string) => {
  await expect(menu(page).getByRole("link", { name: channel })).toHaveAttribute("href", /^https:\/\//);
  await expect(menu(page).getByRole("link", { name: address })).toHaveAttribute("href", `mailto:${address}`);
});

When("I choose {string} in the menu", async ({ page }, name: string) => {
  await menu(page).getByRole("link", { name: new RegExp(`${name}$`) }).click();
});

Then("the menu is closed", async ({ page }) => {
  await expect(menu(page)).toBeHidden();
  await expect(button(page)).toHaveAttribute("aria-expanded", "false");
});

Then("the page is at {string}", async ({ page }, id: string) => {
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
});

Then("there is no menu icon in the bar", async ({ page }) => {
  await expect(button(page)).toBeHidden();
});
