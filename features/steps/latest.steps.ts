import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();
const entries = (page: Page) => page.locator("#latest [data-entry-post]");
let feed = "";

Then("Latest leads with {string} from {string}", async ({ page }, title: string, source: string) => {
  await expect(entries(page).first()).toContainText(title);
  await expect(entries(page).first()).toContainText(source);
});

Then("then shows {string} from {string}, dated {string}", async ({ page }, title: string, source: string, date: string) => {
  const second = entries(page).nth(1);
  await expect(second).toContainText(title);
  await expect(second).toContainText(source);
  await expect(second).toContainText(date);
});

Then("every Latest entry opens its own site in a new tab", async ({ page }) => {
  for (const link of await entries(page).all()) {
    await expect(link).toHaveAttribute("href", /^https:\/\//);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});

When("I read the site's feed", async ({ request }) => {
  feed = await (await request.get("/rss.xml")).text();
});

Then("the feed lists {string} and {string}", async ({}, a: string, b: string) => {
  expect(feed).toContain(`<title>${a}</title>`);
  expect(feed).toContain(`<title>${b}</title>`);
});
