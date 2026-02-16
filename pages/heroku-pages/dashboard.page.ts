import { type Locator, type Page } from '@playwright/test';
import path from 'node:path';

export class HerokuDashboardPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;

    }

    async goto(url: string = ''){
        await this.page.goto('./'+url);
    }

    async viewItemLink(linkName: 'File Upload' | 'File Download' | 'Redirect Link') {
        await this.page.getByRole('link', { name: linkName, exact: true }).click();
    }

    async downloadFiles(fileToBeDownloaded: string[]) {
        for(const eachFile of fileToBeDownloaded) {
            const downloadPromise = this.page.waitForEvent('download');
            await this.page.getByRole('link', { name: eachFile, exact: true }).click();
            const download = await downloadPromise;
            await download.saveAs('playwright/test_data'+download.suggestedFilename());
        }
    }

    async uploadFiles(fileToBeUploaded: string[]) {
        for(const eachFile of fileToBeUploaded) {
            await this.page.locator('//input[@type="file"][@multiple="multiple"]').setInputFiles(path.join(__dirname, `../../test_data/${eachFile}`));
        }
    }

    async uploadAFile(fileToBeUploaded: string) {
        await this.page.locator('//input[@id="file-upload"]').setInputFiles(path.join(__dirname, `../../test_data/${fileToBeUploaded}`));
        await this.page.getByRole('button', { name:'Upload' }).click();
    }
}