import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();
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
  const open = await card(page).boundingBox();
  // The sky on the side of the range the card doesn't hang on.
  const onTheRight = open ? open.x + open.width / 2 > box.x + box.width / 2 : false;
  await page.mouse.click(box.x + box.width * (onTheRight ? 0.3 : 0.7), box.y + box.height * 0.2);
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

When("the card has finished opening", async ({ page }) => {
  await page.waitForTimeout(900);
});

Then("its line draws in from the waypoint", async ({ page }) => {
  const tether = range(page).locator("[data-tether]");
  await expect(tether).toBeVisible();
  // A transition is running on the line right after the choice: it is drawing in, not simply appearing.
  expect(await tether.evaluate((el) => el.getAnimations().length)).toBeGreaterThan(0);
});

Then("its card fades in", async ({ page }) => {
  expect(await card(page).evaluate((el) => el.getAnimations().length)).toBeGreaterThan(0);
});

Given("I am on a medium screen", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 720 });
  await page.reload();
});

Then("the card covers neither the index nor another waypoint", async ({ page }) => {
  await page.waitForTimeout(600);
  const shown = card(page).locator("[data-card-for]:not([hidden])");
  const box = (await shown.boundingBox())!;
  const hits = (b: { x: number; y: number; width: number; height: number }) =>
    box.x < b.x + b.width && b.x < box.x + box.width && box.y < b.y + b.height && b.y < box.y + box.height;
  const index = (await range(page).getByRole("navigation", { name: "Interests" }).boundingBox())!;
  expect(hits(index), "the card covers the index").toBe(false);
  for (const stop of await range(page).locator("[data-stop][aria-pressed=false]").all()) {
    expect(hits((await stop.boundingBox())!), `the card covers waypoint ${await stop.textContent()}`).toBe(false);
  }
});

Given("I am on a large screen", async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 1050 });
  await page.reload();
});

Given("I am on a laptop screen", async ({ page }) => {
  await page.setViewportSize({ width: 1346, height: 900 });
  await page.reload();
});

const ways: string[] = [];
When("I choose each interest in the index in turn", async ({ page }) => {
  ways.length = 0;
  for (const entry of await range(page).getByRole("navigation", { name: "Interests" }).getByRole("button").all()) {
    await entry.click();
    ways.push(await card(page).evaluate((el) => (el.classList.contains("sheet") ? "strip" : "hanging")));
  }
});

Then("every card opened the same way, all hanging on their lines or all as a strip at the foot", async () => {
  expect(ways).toHaveLength(5);
  expect(new Set(ways).size, `the cards opened as ${ways.join(", ")}`).toBe(1);
});
