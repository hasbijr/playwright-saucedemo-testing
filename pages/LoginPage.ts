import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId('username');
        this.passwordInput = page.getByTestId('password');
        this.loginButton = page.getByTestId('login-button');
        this.errorMessage = page.getByTestId('error');
    }

    async goto() {
        await this.page.goto('/');
    }

    async enterUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async submitLogin() {
        await this.loginButton.click();
    }

    async login(username?: string, password?: string) {
        if (username !== undefined) {
            await this.enterUsername(username);
        }
        if (password !== undefined) {
            await this.enterPassword(password);
        }
        await this.submitLogin();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
}
