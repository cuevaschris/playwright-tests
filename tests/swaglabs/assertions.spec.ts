import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/swaglabs-pages/login.page';
import { InventoryPage } from '../../pages/swaglabs-pages/inventory.page';

test.describe('Auto-retrying assertions or also called Locator Assertion', () => {
    test.use({ storageState: 'playwright/.auth/standard_user.json' })
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto('inventory.html');
        await expect(page).toHaveURL(/inventory.html/);

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.resetAppState();
    });

    test('Inventory Page assertions', async ({ page }) => {
        // .toContainsText()    
        const headerContainer = page.locator('#header_container')
        await expect(headerContainer).toContainText('Swag Labs');

        // .toBeVisible()
        const inventoryItemList: string[] = [
            'Sauce Labs Backpack',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket'
        ]
        for (const item of inventoryItemList) {
            const itemContainerWithFilterText = page.getByTestId('inventory-item').filter({ hasText: item });
            await expect(itemContainerWithFilterText).toBeVisible();
        }
        
    });
});

// test.describe('Not-retrying assertions', () => {
//     test.use({ storageState: 'playwright/.auth/standard_user.json' })
//     test.beforeEach(async ({ page }) => {
//         const loginPage = new LoginPage(page);
//         await loginPage.goto('inventory.html');
//         await expect(page).toHaveURL(/inventory.html/);

//         const inventoryPage = new InventoryPage(page);
//         await inventoryPage.resetAppState();

//     });

//     test('', async ({ page }) => {

//     });
// });