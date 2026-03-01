import { Page, Locator } from '@playwright/test';

export class CheckoutOverviewPage {
    readonly page: Page;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly titleHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.finishButton = page.getByTestId('finish');
        this.cancelButton = page.getByTestId('cancel');
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');
        this.titleHeader = page.getByTestId('title');
    }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async getSubtotal() {
        const text = await this.subtotalLabel.textContent();
        return parseFloat(text!.replace('Item total: $', ''));
    }

    async getTax() {
        const text = await this.taxLabel.textContent();
        return parseFloat(text!.replace('Tax: $', ''));
    }

    async getTotal() {
        const text = await this.totalLabel.textContent();
        return parseFloat(text!.replace('Total: $', ''));
    }
}
