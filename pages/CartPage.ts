import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.getByTestId('inventory-item');
        this.checkoutButton = page.getByTestId('checkout');
        this.continueShoppingButton = page.getByTestId('continue-shopping');
    }

    async getCartItemsDescriptions() {
        return await this.cartItems.allTextContents();
    }

    async getCartItemNames() {
        const items = await this.page.locator('.inventory_item_name').allTextContents();
        return items;
    }

    async removeItem(itemName: string) {
        const itemContainer = this.page.locator('.cart_item', { hasText: itemName });
        const removeBtn = itemContainer.locator('button', { hasText: 'Remove' });
        await removeBtn.click();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }
}
