import { Page, Locator } from '@playwright/test';

export class CheckoutInfoPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByTestId('firstName');
        this.lastNameInput = page.getByTestId('lastName');
        this.postalCodeInput = page.getByTestId('postalCode');
        this.continueButton = page.getByTestId('continue');
        this.cancelButton = page.getByTestId('cancel');
        this.errorMessage = page.getByTestId('error');
    }

    async fillInfo(firstName?: string, lastName?: string, postalCode?: string) {
        if (firstName !== undefined) await this.firstNameInput.fill(firstName);
        if (lastName !== undefined) await this.lastNameInput.fill(lastName);
        if (postalCode !== undefined) await this.postalCodeInput.fill(postalCode);
    }

    async submitInfo() {
        await this.continueButton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }

    async cancelCheckout() {
        await this.cancelButton.click();
    }
}
