import {Page, Locator, expect} from "@playwright/test";
import {UserObj} from "@interfaces/UserObject";
import {NewContact} from "@pages/NewContact.page";

export class ContactForm extends NewContact{
    constructor(page: Page) {
        super(page);
    }

    private get editContactButton(): Locator {
        return this.page.locator("#edit-contact");
    }

    private get phoneNumberField(): Locator {
        return this.page.locator("#phone")
    }

    async editContactWithCorrectData(user: UserObj) {
        console.log(user.phoneNumber)
        await this.editContactButton.click()
        await this.firstName.fill(user.firstName);
        await this.lastName.fill(user.lastName);
        await this.dob.fill(user.birthdate);
        await this.phoneNumberField.fill(user.phoneNumber)
        await this.email.fill(user.email.toLowerCase());
        await this.address.fill(user.address);
        await this.city.fill(user.city);
        await this.state.fill(user.state);
        await this.postalCode.fill(user.postalCode);
        await this.country.fill(user.country);
        await this.submitButton.click();
        await this.page.screenshot({path: "test-results/Screenshots/EditedContact.jpeg"})
    }

    async editContactWithInvalidData(user: UserObj) {
        console.log(user.phoneNumber)
        await this.editContactButton.click()
        await this.firstName.fill(user.firstName);
        await this.lastName.fill(user.lastName);
        await this.dob.fill("1111");
        await this.phoneNumberField.fill("test")
        await this.email.fill(user.email.toLowerCase());
        await this.address.fill(user.address);
        await this.city.fill(user.city);
        await this.state.fill(user.state);
        await this.postalCode.fill("test");
        await this.country.fill(user.country);
        await this.submitButton.click();
        await this.page.screenshot({path: "test-results/Screenshots/EditedContact.jpeg"})
        await expect(this.page.locator("#error")).toHaveText("Validation failed: postalCode: Postal code is invalid, phone: Phone number is invalid, birthdate: Birthdate is invalid")
    }

    async checkNewDataInContact(user: UserObj) {
        await expect.soft(this.firstName).toHaveText(user.firstName);
        await expect.soft(this.lastName).toHaveText(user.lastName);
        await expect.soft(this.dob).toHaveText(user.birthdate);
        await expect.soft(this.phoneNumberField).toHaveText(user.phoneNumber);
        await expect.soft(this.email).toHaveText(user.email.toLowerCase());
        await expect.soft(this.address).toHaveText(user.address);
        await expect.soft(this.city).toHaveText(user.city);
        await expect.soft(this.state).toHaveText(user.state);
        await expect.soft(this.postalCode).toHaveText(user.postalCode);
        await expect.soft(this.country).toHaveText(user.country);
    }
}
