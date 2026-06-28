import { test, expect } from '@playwright/test';

test('demo flow: login, upload, analysis, AI tips, logout', async ({ page }) => {
  // 1. Login
  await page.goto('/');
  await expect(page.getByText('Golf Swing AI Login')).toBeVisible();
  await page.getByPlaceholder('Username').fill('testuser');
  await page.getByPlaceholder('Password').fill('testpass');
  await page.getByText('Login / Register').click();
  await expect(page.getByText('Swing Analysis')).toBeVisible();

  // 2. Upload/Select Video
  await page.setInputFiles('input[type="file"]', {
    name: 'swing.mp4',
    mimeType: 'video/mp4',
    buffer: Buffer.from('mock video content'),
  });
  await expect(page.locator('.selected-file')).toContainText('Selected: swing.mp4');

  // 3. Analysis Interaction
  await page.getByRole('button', { name: 'Upload & Analyze' }).click();
  await expect(page.getByText('Analyzing...')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Upload & Analyze' })).toBeVisible(); // Wait for it to return to clickable state

  // 4. AI Tips Panel Visibility
  await expect(page.locator('.tips-panel')).toBeVisible();
  await expect(page.getByText('AI Drills & Tips')).toBeVisible();

  // 5. Phase Interaction (Selecting a phase updates tips)
  await page.getByText('top', { exact: true }).click();
  await expect(page.locator('.phase-badge')).toHaveText('TOP');

  // 6. Logout
  await page.getByText('Logout').click();
  await expect(page.getByText('Golf Swing AI Login')).toBeVisible();
});
