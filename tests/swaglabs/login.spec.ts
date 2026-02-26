import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/swaglabs-pages/login.page';
import { InventoryPage } from '../../pages/swaglabs-pages/inventory.page';

const users = [
    { email: 'standard_user', password: 'secret_sauce' },
    { email: 'problem_user', password: 'secret_sauce' },
    { email: 'performance_glitch_user', password: 'secret_sauce' },
    { email: 'error_user', password: 'secret_sauce' },
    { email: 'visual_user', password: 'secret_sauce' },
];

test.describe('Login Tests', () => {
    test('Should be able to login using standard_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce')
        await expect(page).toHaveURL(/inventory.html/)
    });

    test('Should not be able to login using locked_out_user credentials successfully', async ({ page }) => {
        const errorMessageHeading = page.getByRole('heading', { name: 'Epic sadface: Sorry, this user has been locked out.'})
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('locked_out_user', 'secret_sauce');
        await expect(errorMessageHeading).toBeVisible();
        await expect(page).not.toHaveURL(/inventory.html/)
    });

    test('Should be able to login using problem_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('problem_user', 'secret_sauce')
        await expect(page).toHaveURL(/inventory.html/)
    });

    test('Should be able to login using performance_glitch_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('performance_glitch_user', 'secret_sauce')
        await expect(page).toHaveURL(/inventory.html/)
    });

    test('Should be able to login using error_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('error_user', 'secret_sauce')
        await expect(page).toHaveURL(/inventory.html/)
    });

    test('Should be able to login using visual_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('visual_user', 'secret_sauce')
        await expect(page).toHaveURL(/inventory.html/)
    });
});

for (const user of users ) {
    test.describe('Logout Tests', () => {
        test(`Log out using ${user.email} credential`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(user.email, user.password)
            await expect(page).toHaveURL(/inventory.html/)

            const inventoryPage = new InventoryPage(page);
            await inventoryPage.logout();

            await expect(loginPage.usernameField).toBeVisible();
            await expect(loginPage.passwordField).toBeVisible();
            await expect(loginPage.submitButton).toBeVisible();
        });
    })
}