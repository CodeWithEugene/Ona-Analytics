import { test, expect } from "@playwright/test"

test("full end-to-end registration, login, dashboard, and logout flow", async ({ page }) => {
  const uniqueEmail = `ops_manager_${Date.now()}@ona-analytics.com`
  const campName = `Camp Serengeti Sentinel ${Date.now()}`

  // 1. Visit the Registration Page
  await page.goto("/register")
  
  // Fill out the registration form
  await page.fill("#campName", campName)
  await page.fill("#location", "Serengeti National Park, Tanzania")
  await page.fill("#name", "Chalo Omondi")
  await page.fill("#email", uniqueEmail)
  await page.fill("#password", "SafariSecurity2026!")
  await page.fill("#confirmPassword", "SafariSecurity2026!")
  
  // Click Create Account
  await page.click("button:has-text('Create Account')")

  // Wait for the success state and eventual redirection to the Login Page
  await expect(page).toHaveURL(/\/login/, { timeout: 6000 })

  // 2. Login with the newly registered user
  await page.fill("#email", uniqueEmail)
  await page.fill("#password", "SafariSecurity2026!")
  await page.click("button:has-text('Sign In')")

  // Wait for transition to Dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 6000 })

  // 3. Verify Dashboard content
  // Check that the camp name is displayed in the sidebar/main header
  await expect(page.locator("aside")).toContainText(campName)
  await expect(page.locator("main")).toContainText(campName)
  
  // Verify Dashboard elements like widgets and "Ona Agent" button are present
  await expect(page.getByRole("button", { name: /Ona Agent/i }).first()).toBeVisible()

  // 4. Logout
  // Click user profile menu to expand it
  await page.click("button:has-text('Chalo Omondi')")
  
  // Click Sign Out
  await page.click("button:has-text('Sign out')")

  // Verify redirection back to the landing page
  await expect(page).toHaveURL(/http:\/\/localhost:\d+\/$/, { timeout: 6000 })

  // 5. Verify direct navigation to /dashboard is blocked
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/login/)
})
