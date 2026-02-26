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

        test('should be able to sort the inventory list by Alphabetical order (A-Z)', async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.sortBy('Name (A to Z)');
            await inventoryPage.assertSort('Name (A to Z)');
        });
        
        test('should be able to sort the inventory list by Alphabetical order (Z-A)', async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.sortBy('za');
            await inventoryPage.assertSort('za');
        });
        
        test('should be able to sort the inventory list by Price (low to high)', async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.sortBy('lohi');
            await inventoryPage.assertSort('lohi');
        });

        test('should be able to sort the inventory list by Price (high to low)', async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.sortBy('Price (high to low)');
            await inventoryPage.assertSort('Price (high to low)');
        });
    });
}