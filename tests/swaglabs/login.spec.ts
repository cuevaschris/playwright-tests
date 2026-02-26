import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/swaglabs-pages/login.page';
import { InventoryPage } from '../../pages/swaglabs-pages/inventory.page';

const users = [
    { email: process.env.STANDARD_USER as string, password: process.env.SW_PASSWORD as string },
    { email: process.env.PROBLEM_USER as string, password: process.env.SW_PASSWORD as string },
    { email: process.env.PERFORMANCE_GLITCH_USER as string, password: process.env.SW_PASSWORD as string },
    { email: process.env.ERROR_USER as string, password: process.env.SW_PASSWORD as string },
    { email: process.env.VISUAL_USER as string, password: process.env.SW_PASSWORD as string },
];

test.describe('Login Tests', () => {
    test('Should be able to login using standard_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(process.env.STANDARD_USER as string, process.env.SW_PASSWORD as string)
        await expect(page).toHaveURL(/inventory.html/)
    });

    test('Should not be able to login using locked_out_user credentials successfully', async ({ page }) => {
        const errorMessageHeading = page.getByRole('heading', { name: 'Epic sadface: Sorry, this user has been locked out.'})
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(process.env.LOCKED_OUT_USER as string, process.env.SW_PASSWORD as string);
        await expect(errorMessageHeading).toBeVisible();
        await expect(page).not.toHaveURL(/inventory.html/)
    });

    test('Should be able to login using problem_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(process.env.PROBLEM_USER as string, process.env.SW_PASSWORD as string)
        await expect(page).toHaveURL(/inventory.html/)
    });

    test('Should be able to login using performance_glitch_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(process.env.PERFORMANCE_GLITCH_USER as string, process.env.SW_PASSWORD as string)
        await expect(page).toHaveURL(/inventory.html/)
    });

    test('Should be able to login using error_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(process.env.ERROR_USER as string, process.env.SW_PASSWORD as string)
        await expect(page).toHaveURL(/inventory.html/)
    });

    test('Should be able to login using visual_user credentials successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(process.env.VISUAL_USER as string, process.env.SW_PASSWORD as string)
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