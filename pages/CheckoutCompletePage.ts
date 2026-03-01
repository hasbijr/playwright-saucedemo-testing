import { Page, Locator } from '@playwright/test';

export class CheckoutCompletePage {
    readonly page: Page;
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly backToProductsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.completeHeader = page.getByTestId('complete-header');
        this.completeText = page.getByTestId('complete-text');
        this.backToProductsButton = page.getByTestId('back-to-products');
    }

    async getCompleteHeader() {
        return await this.completeHeader.textContent();
    }

    async getCompleteText() {
        return await this.completeText.textContent();
    }

    async goBackToProducts() {
        await this.backToProductsButton.click();
    }
}
