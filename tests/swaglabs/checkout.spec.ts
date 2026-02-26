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

        test('should be able to checkout all items successfully', { tag: '@smoke' }, async ({ page }) => {
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

        test('should be able to add all items then remove two item then checkout', async ({page}) => {
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

        test('Should be able to clear cart and badge when app state is reset successfully', async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.addItem(itemsToCheckout);
    
            await expect(inventoryPage.cartBadge).toHaveText(String(itemsToCheckout.length));
    
            await inventoryPage.resetAppState();
            await expect(inventoryPage.cartBadge).not.toBeVisible();
    
            await inventoryPage.goToCart();
            await expect(page).toHaveURL(/cart.html/);
            await expect(page.getByTestId('inventory-item')).toHaveCount(0);
        });
    });
}