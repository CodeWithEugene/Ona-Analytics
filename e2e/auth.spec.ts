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

  // Verify Onboarding Walkthrough is visible on first login
  await expect(page.locator("#onboarding-title")).toContainText("Command Center")
  
  // Navigate through the tour steps
  // Step 1 -> Step 2
  await page.click("button:has-text('Next')")
  await expect(page.locator("#onboarding-title")).toContainText("14-Day Demand Forecast")
  
  // Step 2 -> Step 3
  await page.click("button:has-text('Next')")
  await expect(page.locator("#onboarding-title")).toContainText("Automated Procurement")
  
  // Step 3 -> Step 4
  await page.click("button:has-text('Next')")
  await expect(page.locator("#onboarding-title")).toContainText("Field Agent")
  
  // Finish the tour
  await page.click("button:has-text('Finish')")
  await expect(page.locator("#onboarding-title")).not.toBeVisible()

  // 3. Verify Dashboard content
  // Check that the camp name is displayed in the sidebar/main header
  await expect(page.locator("aside")).toContainText(campName)
  await expect(page.locator("main")).toContainText(campName)
  
  // Verify Dashboard elements like widgets and "Ona Agent" button are present
  await expect(page.getByRole("button", { name: /Ona Agent/i }).first()).toBeVisible()

  // 4. Test Restart Tour
  // Click user profile menu to expand it
  await page.click("button:has-text('Chalo Omondi')")
  await page.click("button:has-text('Restart Tour')")
  await expect(page.locator("#onboarding-title")).toContainText("Command Center")
  
  // Skip the restarted tour
  await page.click("button:has-text('Skip')")
  await expect(page.locator("#onboarding-title")).not.toBeVisible()

  // Click user profile menu to expand it again
  await page.click("button:has-text('Chalo Omondi')")
  
  // Click Sign Out
  await page.click("button:has-text('Sign out')")

  // Verify redirection back to the landing page
  await expect(page).toHaveURL(/http:\/\/localhost:\d+\/$/, { timeout: 6000 })

  // 5. Verify direct navigation to /dashboard is blocked
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/login/)
})
