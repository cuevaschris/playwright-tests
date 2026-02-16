import { expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class InventoryPage {
    readonly page: Page;
    readonly inventoryContainer: Locator;
    readonly cartButton: Locator;
    readonly checkoutButton: Locator;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly zipCodeField: Locator;
    readonly checkoutContinueButton: Locator;
    readonly checkoutFinishButton: Locator;
    readonly sortByButton: Locator;
    readonly menuButton: Locator;
    readonly resetAppStateMenuButton: Locator;
    readonly closeMenuButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryContainer = this.page.getByTestId('inventory-item');
        this.cartButton = this.page.getByTestId('shopping-cart-link');
        this.checkoutButton = this.page.getByRole('button', { name: 'Checkout'});
        this.firstNameField = this.page.getByRole('textbox', { name: 'First Name'});
        this.lastNameField = this.page.getByRole('textbox', { name: 'Last Name'});
        this.zipCodeField = this.page.getByRole('textbox', { name: 'Zip/Postal Code'});
        this.checkoutContinueButton = this.page.getByRole('button', { name: 'Continue' });
        this.checkoutFinishButton = this.page.getByRole('button', { name: 'Finish' })
        this.sortByButton = this.page.getByTestId('product-sort-container');
        this.menuButton = this.page.getByRole('button', { name: 'Open Menu'});
        this.resetAppStateMenuButton = this.page.getByRole('link', { name: 'Reset App State' });
        this.closeMenuButton = this.page.getByRole('button', { name: 'Close Menu' });
    }

    async addItem(items: string[]) {
        for(const item of items) {
            const itemContainer = this.inventoryContainer.filter({ hasText: item });
            await itemContainer.getByRole('button', {name: 'Add to cart'}).click()
            await expect(itemContainer.getByRole('button', {name: 'Remove'})).toBeVisible();
        }
    };

    async goToCart(){
        await this.cartButton.click();
    };

    async startCheckout(){
        await this.checkoutButton.click();
    }

    async enterCheckoutDetails(){
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const zipCode = faker.location.zipCode();
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.zipCodeField.fill(zipCode);
        await this.checkoutContinueButton.click();
    }

    async checkout(){
        await this.checkoutFinishButton.click()
    }

    async sortBy(sort: 'Name (A to Z)' | 'az' | 'Name (Z to A)' | 'za' | 'Price (low to high)' | 'lohi' | 'Price (high to low)' | 'hilo'){
        await this.sortByButton.selectOption(sort);
    }

    async openMenu() {
        await this.menuButton.click();
    }

    async resetAppState(){
        this.openMenu();
        await this.resetAppStateMenuButton.click();
        await this.closeMenuButton.click();
    }

    async expectCheckoutSuccess(){
        await expect(this.page).toHaveURL(/checkout-complete.html/);
        await expect(this.page.getByAltText('Pony Express')).toBeVisible();
        await expect(this.page.getByText('Thank you for your order!')).toBeVisible();
        await expect(this.page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')).toBeVisible();
    }

    async assertCartContainsItems(items: string[]) {
        for(const item of items) {
            await expect(this.page.getByTestId('inventory-item').filter({ hasText: item })).toBeVisible();
        }
    }

    async assertPrices() {
        // SUBTOTAL ASSERTION
        let subTotalCalculation = 0;
        for (const price of await this.page.getByTestId('inventory-item-price').all()) {
            const eachItemPrice = await price.textContent();
            const eachItemPriceNoCurr = eachItemPrice?.replace('$', '');
            subTotalCalculation += Number(eachItemPriceNoCurr);
        }
        const subTotalExpected = await this.page.getByTestId('subtotal-label').textContent();
        const subTotalNoCurr = Number(subTotalExpected?.replace('Item total: $', ''));
        expect(subTotalNoCurr).toBe(subTotalCalculation);

        // ADDED TAX ASSERTION - 8% THEN ROUND UP TO THE SECOND DECIMAL
        const addedTaxCalculation = Math.round((subTotalCalculation * 0.08) * 100) / 100;
        const addedTaxExpected = await this.page.getByTestId('tax-label').textContent();
        const addedTaxExpectedNoCurr = Number(addedTaxExpected?.replace('Tax: $', ''));
        expect(addedTaxExpectedNoCurr).toBe(addedTaxCalculation);

        // GRAND TOTAL
        const grandTotalCalculation = subTotalCalculation + addedTaxCalculation;
        const grandTotalExpected = subTotalNoCurr + addedTaxExpectedNoCurr;
        expect(grandTotalExpected).toBe(grandTotalCalculation);
    }

    async assertSort(sort: 'Name (A to Z)' | 'az' | 'Name (Z to A)' | 'za' | 'Price (low to high)' | 'lohi' | 'Price (high to low)' | 'hilo') {
        let prices: number[] = [];
        for (const price of await this.page.getByTestId('inventory-item-price').all()) {
            const eachItemPrice = Number((await price.innerText())?.replace('$', ''));
            prices.push(eachItemPrice);
        }

        let names: string[] = [];
        for (const name of await this.page.getByTestId('inventory-item-name').all()) {
            const eachItemName = await name.innerText();
            names.push(eachItemName);
        }

        if (sort == 'Name (A to Z)' || sort == 'az') {
            const sortedNameByAZ = [...names].sort()
            expect(names).toStrictEqual(sortedNameByAZ);

        } else if (sort == 'Name (Z to A)' || sort == 'za') {
            const sortedNameByZA = [...names].sort((a, b) => b.localeCompare(a))
            expect(names).toStrictEqual(sortedNameByZA);

        } else if (sort == 'Price (low to high)' || sort == 'lohi') {
            const sortedPriceByLoHi = [...prices].sort((a,b) => a - b)
            expect(prices).toStrictEqual(sortedPriceByLoHi);

        } else if (sort == 'Price (high to low)' || sort == 'hilo') {
            const sortedPriceByHiLo = [...prices].sort((a,b) => b - a)
            expect(prices).toStrictEqual(sortedPriceByHiLo);
        }
    }
}
