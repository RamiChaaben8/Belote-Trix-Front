import { expect, test } from "@playwright/test";

test("home page renders with create/join only (guest build)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Belote Trix" })).toBeVisible();
  await expect(page.getByTestId("create-room")).toBeVisible();
  await expect(page.getByTestId("join-room")).toBeVisible();
  // Account navigation is gone: no sign in, no leaderboard/history/profile links.
  await expect(page.getByRole("link", { name: "Sign in" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Leaderboard" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "History" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Profile" })).toHaveCount(0);
  // The guest nickname is generated automatically and shown in the navbar.
  await expect(page.getByTestId("guest-name")).toContainText(/Guest\d{3}/);
});

test("play against bots: lobby, start, choose mode, play a card", async ({ page }) => {
  await page.goto("/");
  // Creating a room pre-fills 3 bot seats, so the host can start right away.
  await page.getByTestId("create-room").click();
  await expect(page.getByTestId("start-game")).toBeEnabled();
  await page.getByTestId("start-game").click();
  await expect(page.getByTestId("current-selector")).toBeVisible();
  await page.getByTestId("mode-Queens").click();
  await expect(page.getByTestId("current-mode")).toContainText("Queens");
  await expect(page.getByTestId("turn-hint")).toContainText("Your turn");
  const card = page.getByTestId("hand").locator("button:not([disabled])").first();
  await card.click();
  await expect(page.getByTestId("hand").locator("button")).toHaveCount(7);
});

test("chat works", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("create-room").click();
  await page.getByLabel("Chat message").fill("hello table");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByTestId("chat-log")).toContainText("hello table");
});

test("removed account pages redirect home instead of erroring", async ({ page }) => {
  for (const path of ["/leaderboard", "/history", "/profile", "/login", "/register"]) {
    await page.goto(path);
    await expect(page).toHaveURL("/");
  }
});
