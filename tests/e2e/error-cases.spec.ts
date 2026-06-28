import { test, expect } from '@playwright/test';

test.describe('Error and Edge Cases', () => {
  test('login failure with empty credentials', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Login / Register')).toBeDisabled();
    await expect(page.getByText('Golf Swing AI Login')).toBeVisible();
  });

  test('upload failure - mock server error', async ({ page }) => {
    // 1. Login
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('testuser');
    await page.getByPlaceholder('Password').fill('testpass');
    await page.getByText('Login / Register').click();
    await expect(page.getByText('Swing Analysis')).toBeVisible();

    // 2. Mock the upload endpoint to return 500
    await page.route('**/upload', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // 3. Upload file
    await page.setInputFiles('input[type="file"]', {
      name: 'fail.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('mock video content'),
    });
    await page.getByRole('button', { name: 'Upload & Analyze' }).click();

    // 4. Expect error message
    await expect(page.locator('.error-banner')).toBeVisible();
    await expect(page.locator('.error-banner')).toContainText('Analysis failed');
  });
});
