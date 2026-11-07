import { expect, test } from '@playwright/test';

test('office list shows the seeded office Chiasso-Brogeda', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('office-row').filter({ hasText: 'Chiasso-Brogeda' })).toBeVisible();
});
