import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get email(): Locator {
        return this.page.locator("#email");
    }

    get password(): Locator {
        return this.page.locator("#password");
    }

    get submitButton(): Locator {
        return this.page.locator("#submit");
    }

    async loginUser(username: string, password: string) {
        await this.email.fill(username);
        await this.password.fill(password);
        await this.submitButton.click();
    }
}
