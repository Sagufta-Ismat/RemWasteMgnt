import { expect, test } from '@playwright/test';

test('general waste booking flow with address lookup', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('postcode-input').fill('SW1A 1AA');
  await page.getByTestId('postcode-lookup-button').click();
  await expect(page.getByTestId('address-select')).toBeVisible();
  await page.getByTestId('address-select').selectOption('addr_3');
  await page.getByTestId('step1-next').click();

  await expect(page.getByTestId('waste-options')).toBeVisible();
  await page.getByLabel('General waste').click();
  await page.getByTestId('step2-next').click();

  await expect(page.getByTestId('skip-grid')).toBeVisible();
  await page.getByTestId('skip-option-4-yard').click();
  await page.getByTestId('step3-next').click();

  await expect(page.getByTestId('review-summary')).toContainText('SW1A 1AA');
  await expect(page.getByTestId('price-breakdown')).toContainText('£120');
  await page.getByTestId('confirm-booking').click();
  await expect(page.getByTestId('booking-success')).toContainText('BK-12345');
});

test('heavy waste flow disables skip sizes and confirms booking', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('postcode-input').fill('SW1A 1AA');
  await page.getByTestId('postcode-lookup-button').click();
  await expect(page.getByTestId('address-select')).toBeVisible();
  await page.getByTestId('address-select').selectOption('addr_1');
  await page.getByTestId('step1-next').click();

  await page.getByLabel('Heavy waste').click();
  await page.getByTestId('step2-next').click();

  await expect(page.getByTestId('skip-grid')).toBeVisible();
  await expect(page.getByTestId('skip-option-12-yard')).toBeDisabled();
  await expect(page.getByTestId('skip-option-16-yard')).toBeDisabled();
  await page.getByTestId('skip-option-10-yard').click();
  await page.getByTestId('step3-next').click();

  await expect(page.getByTestId('review-summary')).toContainText('Heavy waste');
  await page.getByTestId('confirm-booking').click();
  await expect(page.getByTestId('booking-success')).toContainText('BK-12345');
});

test('plasterboard booking path with handling option and review breakdown', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('postcode-input').fill('SW1A 1AA');
  await page.getByTestId('postcode-lookup-button').click();
  await expect(page.getByTestId('address-select')).toBeVisible();
  await page.getByTestId('address-select').selectOption('addr_6');
  await page.getByTestId('step1-next').click();

  await page.getByLabel('Plasterboard').click();
  await page.getByLabel('Full board').click();
  await page.getByTestId('step2-next').click();

  await expect(page.getByTestId('skip-grid')).toBeVisible();
  await page.getByTestId('skip-option-6-yard').click();
  await page.getByTestId('step3-next').click();

  await expect(page.getByTestId('review-summary')).toContainText('Plasterboard');
  await expect(page.getByTestId('review-summary')).toContainText('Full board');
  await expect(page.getByTestId('price-breakdown')).toContainText('£145');
  await page.getByTestId('confirm-booking').click();
  await expect(page.getByTestId('booking-success')).toContainText('BK-12345');
});
