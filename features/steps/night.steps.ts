import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, Then } = createBdd();

Given("it is {string} in {string}", async ({ page }, instant: string, zone: string) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setTimezoneOverride", { timezoneId: zone });
  await page.clock.install({ time: new Date(instant) });
});

Then("the page is at night", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
});

Then("the page is in daylight", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("data-theme", "day");
});

Then("its words are a gentle grey on black, not white", async ({ page }) => {
  const body = page.locator("body");
  await expect(body).toHaveCSS("color", "rgb(201, 197, 189)");
  await expect(page.locator("html")).toHaveCSS("background-color", "rgb(12, 12, 11)");
});
