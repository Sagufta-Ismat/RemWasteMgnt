import { test } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';

test('general waste booking flow with address lookup', async ({ page }) => {
  const bookingPage = new BookingPage(page);

  await bookingPage.goto();
  await bookingPage.lookupAddress('SW1A 1AA', 'addr_3');
  await bookingPage.selectWasteType('General waste');
  await bookingPage.continueToSkips();
  await bookingPage.expectSkipGrid();
  await bookingPage.selectSkip('4-yard');
  await bookingPage.expectReviewContains('SW1A 1AA');
  await bookingPage.expectPriceBreakdownContains('\u00A3120');
  await bookingPage.confirmBooking();
});

test('heavy waste flow disables skip sizes and confirms booking', async ({ page }) => {
  const bookingPage = new BookingPage(page);

  await bookingPage.goto();
  await bookingPage.lookupAddress('SW1A 1AA', 'addr_1');
  await bookingPage.selectWasteType('Heavy waste');
  await bookingPage.continueToSkips();
  await bookingPage.expectSkipGrid();
  await bookingPage.expectSkipDisabled('12-yard');
  await bookingPage.expectSkipDisabled('16-yard');
  await bookingPage.selectSkip('10-yard');
  await bookingPage.expectReviewContains('Heavy waste');
  await bookingPage.confirmBooking();
});

test('plasterboard booking path with handling option and review breakdown', async ({ page }) => {
  const bookingPage = new BookingPage(page);

  await bookingPage.goto();
  await bookingPage.lookupAddress('SW1A 1AA', 'addr_6');
  await bookingPage.selectWasteType('Plasterboard');
  await bookingPage.selectPlasterboardOption('Full board');
  await bookingPage.continueToSkips();
  await bookingPage.expectSkipGrid();
  await bookingPage.selectSkip('6-yard');
  await bookingPage.expectReviewContains('Plasterboard');
  await bookingPage.expectReviewContains('Full board');
  await bookingPage.expectPriceBreakdownContains('\u00A3145');
  await bookingPage.confirmBooking();
});
