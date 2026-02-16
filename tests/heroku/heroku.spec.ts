import { expect, test } from '@playwright/test';
import { HerokuDashboardPage } from '../../pages/heroku-pages/dashboard.page';

test.beforeEach(async ({ page }) => {
    const herokuDashboardPage = new HerokuDashboardPage(page);
    await herokuDashboardPage.goto();
})

test('Navigate to Heroku App Dashboard', async ({ page }) => {
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/');
});

test('File Download', async ({ page })=> {
    const herokuDashboardPage = new HerokuDashboardPage(page);
    
    // Upload a file to be downloaded later
    await herokuDashboardPage.viewItemLink('File Upload');
    await herokuDashboardPage.uploadAFile('chris_pogi.txt');

    await herokuDashboardPage.goto();
    await herokuDashboardPage.viewItemLink('File Download');
    await expect(page).toHaveURL(/download/);
    await herokuDashboardPage.downloadFiles([
        'chris_pogi.txt',
    ]);
});

test('File Upload - Multiple Files', async ({ page }) => {
    const herokuDashboardPage = new HerokuDashboardPage(page);
    await herokuDashboardPage.viewItemLink('File Upload');
    await herokuDashboardPage.uploadFiles([
        'chris_pogi.txt',
        'sample.txt',
        'this is me.txt'
    ]);
})

test('File Upload - Single File', async ({ page }) => {
    const herokuDashboardPage = new HerokuDashboardPage(page);
    await herokuDashboardPage.viewItemLink('File Upload');
    await herokuDashboardPage.uploadAFile('this is me.txt');
})