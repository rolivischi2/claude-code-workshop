import { expect, test } from '@playwright/test';

/** Tomorrow 10:00 as a value for <input type="datetime-local">, in the browser's local time. */
function tomorrowAtTen(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00`;
}

test('shows the backend message when the guarantee does not cover the amount', async ({ page }) => {
  await page.goto('/offices/CH004567/declare');
  // Zoneless Angular: wait for the loaded form before filling it.
  await expect(page.getByRole('heading', { name: /Genève-Routes/ })).toBeVisible();

  await page.getByTestId('destination').selectOption('CH001234');
  await page.getByTestId('guarantee').selectOption('26CH1000000000033');
  // Always beyond the reference amount (10 000), so the test can run again against the same backend.
  await page.getByTestId('amount').fill('999999');
  await page.getByTestId('released-at').fill(tomorrowAtTen());
  await page.getByTestId('submit').click();

  await expect(page.getByTestId('server-error')).toContainText(
    'Referenzbetrag der Garantie überschritten',
  );
  await expect(page.getByTestId('submit')).toBeEnabled();
  await expect(page).toHaveURL(/\/offices\/CH004567\/declare$/);
});
