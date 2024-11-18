import {expect, Locator, Page} from "@playwright/test";

export class CreateUser {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createUser(user) {
        const email = this.page.locator("#email");
        const password = this.page.locator("#password");
        const signupButton = this.page.locator("#signup");
        const firstName = this.page.locator("#firstName");
        const lastName = this.page.locator("#lastName");
        const submitButton = this.page.locator("#submit");

        await this.page.goto(process.env.URL);
        await signupButton.click();
        await firstName.fill(user.username);
        await lastName.fill(user.userLastName);
        await email.fill(user.userEmail);
        await password.fill(user.userPassword);
        await submitButton.click();
    }
}
