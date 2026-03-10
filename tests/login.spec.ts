import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Saucedemo Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test.describe('Successful Logins', () => {

        test('should log in successfully as a standard user', async ({ page }) => {
            await loginPage.login('standard_user', 'secret_sauce');
            await expect(page).toHaveURL(/.*inventory.html/);
            await expect(page.getByText('Products')).toBeVisible();
        });

        test('should log in successfully as a problem user', async ({ page }) => {
            await loginPage.login('problem_user', 'secret_sauce');
            await expect(page).toHaveURL(/.*inventory.html/);
        });

        test('should log in successfully as a performance glitch user', async ({ page }) => {
            await loginPage.login('performance_glitch_user', 'secret_sauce');
            await expect(page).toHaveURL(/.*inventory.html/);
        });

        test('should log in successfully as an error user', async ({ page }) => {
            await loginPage.login('error_user', 'secret_sauce');
            await expect(page).toHaveURL(/.*inventory.html/);
        });

        test('should log in successfully as a visual user', async ({ page }) => {
            await loginPage.login('visual_user', 'secret_sauce');
            await expect(page).toHaveURL(/.*inventory.html/);
        });
    });

    test.describe('Failed Logins', () => {

        test('should display an error when using an invalid username', async () => {
            await loginPage.login('invalid_user', 'secret_sauce');
            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Epic sadface: Username and password do not match any user in this service');
        });

        test('should display an error when using an invalid password', async () => {
            await loginPage.login('standard_user', 'wrong_password');
            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Epic sadface: Username and password do not match any user in this service');
        });

        test('should display an error when the username field is empty', async () => {
            await loginPage.login(undefined, 'secret_sauce');
            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Epic sadface: Username is required');
        });

        test('should display an error when the password field is empty', async () => {
            await loginPage.login('standard_user', undefined);
            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Epic sadface: Password is required');
        });

        test('should display an error for a locked out user', async () => {
            await loginPage.login('locked_out_user', 'secret_sauce');
            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Epic sadface: Sorry, this user has been locked out.');
        });

    });
});
