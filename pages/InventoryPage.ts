import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly inventoryItems: Locator;
    readonly sortDropdown: Locator;
    readonly shoppingCartLink: Locator;
    readonly shoppingCartBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.getByTestId('inventory-item');
        this.sortDropdown = page.getByTestId('product-sort-container');
        this.shoppingCartLink = page.getByTestId('shopping-cart-link');
        this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
    }

    async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.sortDropdown.selectOption(option);
    }

    async getButtonForItem(itemName: string) {
        const itemContainer = this.page.locator('.inventory_item', { hasText: itemName });
        return itemContainer.locator('button');
    }

    async addOrRemoveItem(itemName: string) {
        const button = await this.getButtonForItem(itemName);
        await button.click();
    }

    async getCartCount() {
        if (await this.shoppingCartBadge.isVisible()) {
            return await this.shoppingCartBadge.textContent();
        }
        return '0';
    }

    async goToCart() {
        await this.shoppingCartLink.click();
    }
}
