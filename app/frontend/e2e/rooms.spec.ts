import { expect, test } from '@playwright/test';

test('room list shows the seeded room Eiger', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('room-row').filter({ hasText: 'Eiger' })).toBeVisible();
});
