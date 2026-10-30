import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, Then } = createBdd();

Given("I open the home page", async ({ page }) => {
  await page.goto("/");
});

Then("the sections are {string}, {string} and {string}, numbered {string}, {string} and {string}",
  async ({ page }, a: string, b: string, c: string, n1: string, n2: string, n3: string) => {
    const handlers = page.locator("main section > .handler");
    await expect(handlers.locator(".label")).toHaveText([a, b, c]);
    await expect(handlers.locator(".number")).toHaveText([n1, n2, n3]);
  });

Then("the bar shows {string} linking to the top of the page", async ({ page }, name: string) => {
  const mark = page.getByRole("banner").getByRole("link", { name });
  await expect(mark).toHaveAttribute("href", "#top");
});

Then("the bar offers {string}", async ({ page }, label: string) => {
  const letter = page.getByRole("banner").locator("[data-ask]");   // the bar's own letter, not the menu's link
  await expect(letter).toBeVisible();
  await expect(letter).toHaveText(label);
});

Then("the footer links to {string}, {string}, {string}, {string} and {string}",
  async ({ page }, a: string, b: string, c: string, d: string, e: string) => {
    const footer = page.getByRole("contentinfo");
    for (const name of [a, b, c, d, e]) await expect(footer.getByRole("link", { name })).toBeVisible();
  });

Then("the footer links to {string}", async ({ page }, name: string) => {
  await expect(page.getByRole("contentinfo").getByRole("link", { name })).toHaveAttribute("href", /^https:\/\//);
});

Then("every channel link leaves for its own site", async ({ page }) => {
  const channels = page.getByRole("contentinfo").getByRole("navigation", { name: "Channels" }).getByRole("link");
  for (const link of await channels.all()) {
    await expect(link).toHaveAttribute("href", /^https:\/\//);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});

Then("the footer shows {string} as a mail link", async ({ page }, address: string) => {
  await expect(page.getByRole("contentinfo").getByRole("link", { name: address })).toHaveAttribute("href", `mailto:${address}`);
});
