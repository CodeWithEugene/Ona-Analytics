import { test, expect } from "@playwright/test"

test("landing page loads and shows key content", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("h1")).toContainText("before")
  await expect(page.locator("text=Start 14-Day Trial")).toBeVisible()
  await expect(page.locator("text=Ona Analytics").first()).toBeVisible()
})

test("login page has form fields", async ({ page }) => {
  await page.goto("/login")
  await expect(page.locator("#email")).toBeVisible()
  await expect(page.locator("#password")).toBeVisible()
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible()
})

test("register page has form fields", async ({ page }) => {
  await page.goto("/register")
  await expect(page.locator("#email")).toBeVisible()
  await expect(page.locator("#password")).toBeVisible()
  await expect(page.locator("#name")).toBeVisible()
  await expect(page.getByRole("button", { name: /create/i })).toBeVisible()
})

test("unauthenticated user is redirected from dashboard", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/login/)
})
