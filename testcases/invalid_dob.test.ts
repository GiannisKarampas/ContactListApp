import {expect, test} from "@playwright/test";
import {LoginPage} from "../pages/login.page";
import {Logger} from "../utils/common/logger.utils";

const logger = Logger.loggerSetup();

test("Add a contact with invalid date of birth and validate the error message.", async ({page}) => {
    const login = new LoginPage(page);
    const email = page.locator("#email");
    const submitButton = page.locator("#submit");
    const firstName = page.locator("#firstName");
    const lastName = page.locator("#lastName");
    const dob = page.locator("#birthdate");
    const newContact = page.locator("#add-contact");
    const errorMessage = page.locator("#error");

    // Login
    await login.loginUser();

    // Add new contact
    await newContact.click();
    await firstName.fill("Test");
    await lastName.fill("Test Lastname");
    await dob.fill("13456789");
    await email.fill(process.env.USERNAME);
    await page.screenshot({path: "screenshot.png"});
    await submitButton.click();

    // Check the error message
    await expect(errorMessage).toHaveText("Contact validation failed: birthdate: Birthdate is invalid");
});
