import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/swaglabs-pages/login.page';
import { InventoryPage } from '../../pages/swaglabs-pages/inventory.page';

test.describe('Swag Labs inventory', () => {
    test.use({ storageState: 'playwright/.auth/standard_user.json' });

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto('inventory.html');
        await expect(page).toHaveURL(/inventory.html/);

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.resetAppState();
    });

    test('Should be able to see header and all products successfully', async ({ page }) => {
        const headerContainer = page.locator('#header_container');
        await expect(headerContainer).toContainText('Swag Labs');

        const inventoryItemList: string[] = [
            'Sauce Labs Backpack',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket'
        ];

        for (const item of inventoryItemList) {
            const itemContainer = page
                .getByTestId('inventory-item')
                .filter({ hasText: item });

            await expect(itemContainer).toBeVisible();
        }
    });
});
