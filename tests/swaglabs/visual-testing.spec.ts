import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/swaglabs-pages/login.page';
import { InventoryPage } from '../../pages/swaglabs-pages/inventory.page';

const users = [
    { name: 'Standard User', storage: 'playwright/.auth/standard_user.json'}, 
    { name: 'Problem User', storage: 'playwright/.auth/problem_user.json'}, 
    { name: 'Visual User', storage: 'playwright/.auth/visual_user.json'}, 
]

for( const user of users ) {
    test.describe(user.name, () => {
        test.use({ storageState: user.storage });
        test.beforeEach(async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.goto('inventory.html');
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.resetAppState();
        });
        
        test('visual testing - inventory page', async({ page }) => {
            await expect(page).toHaveScreenshot('inventory-page.png', { fullPage: true });
        });
    });
}