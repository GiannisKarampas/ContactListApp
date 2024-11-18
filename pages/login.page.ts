import {expect, Locator, Page} from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly email: Locator;
    readonly password: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.email = page.locator("#email");
        this.password = page.locator("#password");
        this.submitButton = page.locator("#submit");
    }

    async loginUser() {
        // Login
        await this.page.goto(process.env.URL);
        await this.email.fill(process.env.USERNAME);
        await this.password.fill(process.env.PASSWORD);
        await this.submitButton.click();
    }
}
