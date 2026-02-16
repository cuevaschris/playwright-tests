import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage{
    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator; 
    readonly submitButton: Locator;
    
    constructor(page: Page) {
        this.page = page; 
        this.usernameField = this.page.getByPlaceholder('Username');
        this.passwordField = this.page.getByPlaceholder('Password');
        this.submitButton = this.page.getByRole('button', { name: 'Login'});
    }

    async goto(url: string = '') {
        await this.page.goto('./'+url);
    }

    async login(email: string, password: string) {
        await this.usernameField.fill(email);
        await this.passwordField.fill(password);
        await this.submitButton.click()
        await expect(this.page).toHaveURL(/inventory.html/)
    }
}