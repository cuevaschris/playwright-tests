import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/swaglabs-pages/login.page';
import { InventoryPage } from '../../pages/swaglabs-pages/inventory.page';

const itemsToCheckout: string[] = [
    'Sauce Labs Backpack',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket'
];

const itemsToRemoveAtTheCart: string[] = [
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bolt T-Shirt',
]

const finalItemsAtTheCardAfterRemovals: string[] = [
    'Sauce Labs Backpack',
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Fleece Jacket'
]

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
        
        test('should navigate to dashboard page', async ({ page }) => {
            await expect(page).toHaveURL(/inventory.html/)
        });

        test('should be able to checkout three items successfully', async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.addItem(itemsToCheckout);

            await inventoryPage.goToCart();
            await expect(page).toHaveURL(/cart.html/);
            await inventoryPage.assertCartContainsItems(itemsToCheckout)

            await inventoryPage.startCheckout();
            await expect(page).toHaveURL(/checkout-step-one.html/);
        
            await inventoryPage.enterCheckoutDetails();    // random data via faker library
            await expect(page).toHaveURL(/checkout-step-two.html/);
            await inventoryPage.assertPrices();

            await inventoryPage.checkout();
            await inventoryPage.expectCheckoutSuccess();
        });

        test('should be able to add three items then remove one item then checkout', async ({page}) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.addItem(itemsToCheckout);

            await inventoryPage.goToCart();
            await expect(page).toHaveURL(/cart.html/);
            await inventoryPage.removeItemOnCart(itemsToRemoveAtTheCart);
            await inventoryPage.assertCartContainsItems(finalItemsAtTheCardAfterRemovals)

            await inventoryPage.startCheckout();
            await expect(page).toHaveURL(/checkout-step-one.html/);
        
            await inventoryPage.enterCheckoutDetails();    // random data via faker library
            await expect(page).toHaveURL(/checkout-step-two.html/);
            await inventoryPage.assertPrices();

            await inventoryPage.checkout();
            await inventoryPage.expectCheckoutSuccess();
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

        test('visual testing - inventory page', async({ page }) => {
            await expect(page).toHaveScreenshot('inventory-page.png', { fullPage: true });
        });
    });
}