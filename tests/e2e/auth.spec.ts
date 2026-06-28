import { test, expect } from '@playwright/test';

test('basic authentication flow', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Golf Swing AI Login')).toBeVisible();
  await page.getByPlaceholder('Username').fill('testuser');
  await page.getByText('Login / Register').click();
  await expect(page.getByText('Swing Analysis')).toBeVisible();
  await page.getByText('Logout').click();
  await expect(page.getByText('Golf Swing AI Login')).toBeVisible();
});
