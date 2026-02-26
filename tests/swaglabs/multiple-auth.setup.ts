import { test as setup, expect } from '@playwright/test'
import path from 'path';
import { LoginPage } from '../../pages/swaglabs-pages/login.page';

const standard_user = path.join(__dirname, '../../playwright/.auth/standard_user.json');
setup('authenticate standard_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.STANDARD_USER as string, process.env.SW_PASSWORD as string);
    await expect(page).toHaveURL(/inventory.html/);

    await page.context().storageState({ path: standard_user})
});

const visual_user = path.join(__dirname, '../../playwright/.auth/visual_user.json');
setup('authenticate visual_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.VISUAL_USER as string, process.env.SW_PASSWORD as string);
    await expect(page).toHaveURL(/inventory.html/);

    await page.context().storageState({ path: visual_user})
});

const problem_user = path.join(__dirname, '../../playwright/.auth/problem_user.json');
setup('authenticate problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.PROBLEM_USER as string, process.env.SW_PASSWORD as string);
    await expect(page).toHaveURL(/inventory.html/);

    await page.context().storageState({ path: problem_user})
});
