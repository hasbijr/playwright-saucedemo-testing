import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

test.describe('Saucedemo End-to-End Checkout Tests', () => {

    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutInfoPage: CheckoutInfoPage;
    let checkoutOverviewPage: CheckoutOverviewPage;
    let checkoutCompletePage: CheckoutCompletePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutInfoPage = new CheckoutInfoPage(page);
        checkoutOverviewPage = new CheckoutOverviewPage(page);
        checkoutCompletePage = new CheckoutCompletePage(page);

        await loginPage.goto();
    });

    test.describe('Successful Checkout Flows', () => {

        test('should checkout a single item successfully as a standard user', async ({ page }) => {
            await loginPage.login('standard_user', 'secret_sauce');

            await inventoryPage.addOrRemoveItem('Sauce Labs Backpack');
            expect(await inventoryPage.getCartCount()).toBe('1');

            await inventoryPage.goToCart();
            const cartItems = await cartPage.getCartItemNames();
            expect(cartItems).toContain('Sauce Labs Backpack');
            await cartPage.proceedToCheckout();
            await checkoutInfoPage.fillInfo('Adam', 'Jack', '12345');
            await checkoutInfoPage.submitInfo();

            await expect(checkoutOverviewPage.titleHeader).toHaveText('Checkout: Overview');
            await checkoutOverviewPage.finishCheckout();

            expect(await checkoutCompletePage.getCompleteHeader()).toBe('Thank you for your order!');
        });

        test('should sort items by price and checkout the cheapest and most expensive', async ({ page }) => {
            await loginPage.login('standard_user', 'secret_sauce');

            await inventoryPage.sortBy('lohi');
            await inventoryPage.addOrRemoveItem('Sauce Labs Onesie');
            await inventoryPage.addOrRemoveItem('Sauce Labs Fleece Jacket');
            expect(await inventoryPage.getCartCount()).toBe('2');

            await inventoryPage.goToCart();
            await cartPage.proceedToCheckout();

            await checkoutInfoPage.fillInfo('Adam', 'Jack', '12345');
            await checkoutInfoPage.submitInfo();

            await expect(checkoutOverviewPage.titleHeader).toHaveText('Checkout: Overview');
            await checkoutOverviewPage.finishCheckout();
            expect(await checkoutCompletePage.getCompleteHeader()).toBe('Thank you for your order!');
        });

        test('should allow removing an item from the cart before completing checkout', async ({ page }) => {
            await loginPage.login('standard_user', 'secret_sauce');

            await inventoryPage.addOrRemoveItem('Sauce Labs Backpack');
            await inventoryPage.addOrRemoveItem('Sauce Labs Bike Light');
            await inventoryPage.addOrRemoveItem('Sauce Labs Bolt T-Shirt');
            expect(await inventoryPage.getCartCount()).toBe('3');

            await inventoryPage.goToCart();

            await cartPage.removeItem('Sauce Labs Bike Light');

            const cartItems = await cartPage.getCartItemNames();
            expect(cartItems).toHaveLength(2);
            expect(cartItems).not.toContain('Sauce Labs Bike Light');

            await cartPage.proceedToCheckout();
            await checkoutInfoPage.fillInfo('Adam', 'Jack', '12345');
            await checkoutInfoPage.submitInfo();
            await checkoutOverviewPage.finishCheckout();
            expect(await checkoutCompletePage.getCompleteHeader()).toBe('Thank you for your order!');
        });

        test('should fail checkout for a problem user due to missing last name error', async ({ page }) => {
            await loginPage.login('problem_user', 'secret_sauce');

            await inventoryPage.addOrRemoveItem('Sauce Labs Backpack');
            await inventoryPage.goToCart();
            await cartPage.proceedToCheckout();
            await checkoutInfoPage.fillInfo('Adam', 'Jack', '12345');
            await checkoutInfoPage.submitInfo();
            const errorMsg = await checkoutInfoPage.getErrorMessage();
            expect(errorMsg).toContain('Error: Last Name is required');
        });

        test('should calculate and display the correct subtotal, tax, and total prices', async ({ page }) => {
            await loginPage.login('standard_user', 'secret_sauce');

            await inventoryPage.addOrRemoveItem('Sauce Labs Backpack');
            await inventoryPage.addOrRemoveItem('Sauce Labs Bike Light');

            await inventoryPage.goToCart();
            await cartPage.proceedToCheckout();

            await checkoutInfoPage.fillInfo('Adam', 'Jack', '12345');
            await checkoutInfoPage.submitInfo();

            const subtotal = await checkoutOverviewPage.getSubtotal();
            const tax = await checkoutOverviewPage.getTax();
            const total = await checkoutOverviewPage.getTotal();
            expect(subtotal).toBeCloseTo(39.98);
            expect(tax).toBeCloseTo(3.20);
            expect(total).toBeCloseTo(subtotal + tax);

            await checkoutOverviewPage.finishCheckout();
        });
    });

    test.describe('Checkout Validation Flows', () => {

        test('should show an error when the first name is missing', async ({ page }) => {
            await loginPage.login('standard_user', 'secret_sauce');
            await inventoryPage.addOrRemoveItem('Sauce Labs Backpack');
            await inventoryPage.goToCart();
            await cartPage.proceedToCheckout();

            await checkoutInfoPage.fillInfo(undefined, 'Jack', '12345');
            await checkoutInfoPage.submitInfo();

            const errorMsg = await checkoutInfoPage.getErrorMessage();
            expect(errorMsg).toContain('Error: First Name is required');
        });

        test('should show an error when the last name is missing', async ({ page }) => {
            await loginPage.login('standard_user', 'secret_sauce');
            await inventoryPage.addOrRemoveItem('Sauce Labs Backpack');
            await inventoryPage.goToCart();
            await cartPage.proceedToCheckout();

            await checkoutInfoPage.fillInfo('Adam', undefined, '12345');
            await checkoutInfoPage.submitInfo();

            const errorMsg = await checkoutInfoPage.getErrorMessage();
            expect(errorMsg).toContain('Error: Last Name is required');
        });

        test('should show an error when the postal code is missing', async ({ page }) => {
            await loginPage.login('standard_user', 'secret_sauce');
            await inventoryPage.addOrRemoveItem('Sauce Labs Backpack');
            await inventoryPage.goToCart();
            await cartPage.proceedToCheckout();

            await checkoutInfoPage.fillInfo('Adam', 'Jack', undefined);
            await checkoutInfoPage.submitInfo();

            const errorMsg = await checkoutInfoPage.getErrorMessage();
            expect(errorMsg).toContain('Error: Postal Code is required');
        });

        test('should navigate to the checkout step even when the cart is empty', async ({ page }) => {
            await loginPage.login('standard_user', 'secret_sauce');
            await inventoryPage.goToCart();
            const cartItems = await cartPage.getCartItemNames();
            expect(cartItems).toHaveLength(0);
            await cartPage.proceedToCheckout();
            await expect(checkoutInfoPage.page).toHaveURL(/.*checkout-step-one.html/);
        });

        test('should retain the default sort order for an error user since sorting fails', async ({ page }) => {
            await loginPage.login('error_user', 'secret_sauce');

            await inventoryPage.sortBy('lohi');

            const firstItem = page.locator('.inventory_item_name').first();
            await expect(firstItem).not.toHaveText('Sauce Labs Onesie');
            await expect(firstItem).toHaveText('Sauce Labs Backpack');
        });

    });

});
