import {expect, Locator, Page} from "@playwright/test";
import {getStringParameter} from "@utils/common/TestDataConfig.utils";

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get usernameInput(): Locator {
        return this.page.locator("#user-nameext-34-inputEl");
    }

    get passwordInput(): Locator {
        return this.page.locator("#passwordext-34-inputEl");
    }

    get applicationBanner(): Locator {
        return this.page.locator(".logon-application-banner");
    }

    get usernameLabel(): Locator {
        return this.page.getByText("Username");
    }

    get passwordLabel(): Locator {
        return this.page.getByText("Password");
    }

    get errorLabel(): Locator {
        return this.page.locator("//label[starts-with(@id, 'error-labelext') or starts-with(@id, 'warning-labelext')][text()]");
    }

    get loginButton(): Locator {
        return this.page.getByRole("button", {name: "Login"});
    }

    get ssoCancelButton(): Locator {
        return this.page.locator("#desktopSsoCancel");
    }

    get ssoBackButton(): Locator {
        return this.page.locator("//img[contains(@src, 'arrow_left')] | //input[@id='idBtn_Back']");
    }

    get ssoUseAnotherAccountButton(): Locator {
        return this.page.getByText("Use another account");
    }

    get ssoUsernameTextbox(): Locator {
        return this.page.locator("//input[@type='email']");
    }

    get ssoNextButton(): Locator {
        return this.page.locator("//input[@type='submit']");
    }

    get ssoPasswordTextbox(): Locator {
        return this.page.locator("//input[@name='passwd']");
    }


    /**
     * Go to login page.
     * @param url
     * @param country optional
     */
    async navigate(url: string) {
        await this.page.goto(url, {waitUntil: "domcontentloaded"});
    }

    /**
     * Inputs username and password and clicks login button to login to the application
     * @param username
     * @param password
     * @param msLogin // Optional
     */
    async login(username: string, password: string | Promise<string>);
    async login(username: string, password: string, msLogin: string);

    async login(username: string, password: string | Promise<string>, region: string = process.env.REGION) {
        
        if (region === "EMEA") {
            const samlButton = this.page.locator("#zocial-saml");

            await samlButton.click();
            await this.ssoUsernameTextbox.fill(`${username}@chubb.com`);
            await this.ssoNextButton.click();
            await this.ssoPasswordTextbox.fill(password.toString());
            await this.ssoNextButton.click();

            return;
        }
        await this.ssoLogin(username, password)
    }

    async ssoLogin(username: string, password: string | Promise<string>) {
        try {
            await this.ssoCancelButton.click();
            await this.ssoBackButton.waitFor({state: "visible"});
            await this.ssoBackButton.click();
            await this.ssoUseAnotherAccountButton.click({timeout: 3000});
        } catch (error) {}

        await this.ssoUsernameTextbox.fill(`${username}@chubb.com`);
        await this.ssoNextButton.click();
        await this.page.waitForTimeout(2000)
        await this.ssoPasswordTextbox.fill(password.toString());
        await this.ssoNextButton.click();

        await this.page.waitForSelector("#headerTitle");
    }

    /**
     * Inputs username and password and clicks login button to login to the application
     * @param dataIndex the index of the parameter in the data file, if used.
     */
    async loginWithTestDataConfig(dataIndex?: number) {
        const username = getStringParameter("Login_Username", dataIndex);
        const password = getStringParameter("Login_Password", dataIndex);

        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /**
     * Asserts all element exist and are visible in the login page.
     */
    async verifyLoginPage() {
        await expect(this.applicationBanner).toBeVisible();
        await expect(this.usernameLabel).toBeVisible();
        await expect(this.passwordLabel).toBeVisible();
        return this.page;
    }

    /**
     * Verifies that the expected message is displayed for an invalid login attempt.
     * @param dataIndex the index of the parameter in the data file, if used.
     */
    async verifyInvalidLoginMessage(dataIndex?: number) {
        const expectedErrorMessage = getStringParameter("Login_Expected_Error_Message", dataIndex);

        await this.errorLabel.waitFor({state: "visible"});
        expect.soft(await this.errorLabel.textContent(), {message: "Incorrect message in Authentication error"}).toContain(expectedErrorMessage);
        return this.page;
    }
}
