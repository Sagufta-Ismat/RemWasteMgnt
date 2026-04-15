import { expect, type Locator, type Page } from '@playwright/test';

export class BookingPage {
  readonly page: Page;
  readonly postcodeInput: Locator;
  readonly postcodeLookupButton: Locator;
  readonly addressSelect: Locator;
  readonly wasteOptions: Locator;
  readonly skipGrid: Locator;
  readonly reviewSummary: Locator;
  readonly priceBreakdown: Locator;
  readonly confirmBookingButton: Locator;
  readonly bookingSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    this.postcodeInput = page.getByTestId('postcode-input');
    this.postcodeLookupButton = page.getByTestId('postcode-lookup-button');
    this.addressSelect = page.getByTestId('address-select');
    this.wasteOptions = page.getByTestId('waste-options');
    this.skipGrid = page.getByTestId('skip-grid');
    this.reviewSummary = page.getByTestId('review-summary');
    this.priceBreakdown = page.getByTestId('price-breakdown');
    this.confirmBookingButton = page.getByTestId('confirm-booking');
    this.bookingSuccess = page.getByTestId('booking-success');
  }

  async goto() {
    await this.page.goto('/');
  }

  async lookupAddress(postcode: string, addressId: string) {
    await this.postcodeInput.fill(postcode);
    await this.postcodeLookupButton.click();
    await expect(this.addressSelect).toBeVisible();
    await this.addressSelect.selectOption(addressId);
    await this.page.getByTestId('step1-next').click();
  }

  async selectWasteType(wasteType: 'General waste' | 'Heavy waste' | 'Plasterboard') {
    await expect(this.wasteOptions).toBeVisible();
    await this.page.getByLabel(wasteType).click();
  }

  async selectPlasterboardOption(option: 'Separate bag' | 'Sealed sheet' | 'Full board') {
    await this.page.getByLabel(option).click();
  }

  async continueToSkips() {
    await this.page.getByTestId('step2-next').click();
  }

  async expectSkipGrid() {
    await expect(this.skipGrid).toBeVisible();
  }

  async expectSkipDisabled(size: string) {
    await expect(this.page.getByTestId(`skip-option-${size}`)).toBeDisabled();
  }

  async selectSkip(size: string) {
    await this.page.getByTestId(`skip-option-${size}`).click();
    await this.page.getByTestId('step3-next').click();
  }

  async expectReviewContains(text: string) {
    await expect(this.reviewSummary).toContainText(text);
  }

  async expectPriceBreakdownContains(text: string) {
    await expect(this.priceBreakdown).toContainText(text);
  }

  async confirmBooking() {
    await this.confirmBookingButton.click();
    await expect(this.bookingSuccess).toContainText('BK-12345');
  }
}
