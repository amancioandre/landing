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

const cover = (page: Page) => entries(page).first().locator("img");
const box = async (l: ReturnType<Page["locator"]>) => (await l.boundingBox())!;

Then("the newest post's cover sits beside its words", async ({ page }) => {
  await expect(cover(page)).toHaveAttribute("src", "https://i2.ytimg.com/vi/abc123/hqdefault.jpg");
  const [picture, title] = [await box(cover(page)), await box(entries(page).first().locator(".title"))];
  expect(picture.x).toBeGreaterThan(title.x + title.width);
  expect(picture.y).toBeLessThanOrEqual(title.y);
});

Then("only the newest post shows a cover", async ({ page }) => {
  await expect(page.locator("#latest [data-entry-post] img")).toHaveCount(1);
});

Then("the newest post's cover sits above its title", async ({ page }) => {
  const [picture, title] = [await box(cover(page)), await box(entries(page).first().locator(".title"))];
  expect(picture.y + picture.height).toBeLessThanOrEqual(title.y);
  expect(picture.width).toBeGreaterThan(300);
});
