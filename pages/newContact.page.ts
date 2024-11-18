import {Page} from "@playwright/test";

export class NewContact {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createNewContact(user) {
        const newContact = this.page.locator("#add-contact");
        const firstName = this.page.locator("#firstName");
        const lastName = this.page.locator("#lastName");
        const email = this.page.locator("#email");
        const dob = this.page.locator("#birthdate");
        const address = this.page.locator("#street1");
        const city = this.page.locator("#city");
        const state = this.page.locator("#stateProvince");
        const postalCode = this.page.locator("#postalCode");
        const country = this.page.locator("#country");
        const submitButton = this.page.locator("#submit");

        // Add new contact
        await newContact.click();
        await firstName.fill(user.username);
        await lastName.fill(user.userLastName);
        await dob.fill(user.userBirthday);
        await email.fill(user.userEmail);
        await address.fill(user.userAddress);
        await city.fill(user.userCity);
        await state.fill(user.userState);
        await postalCode.fill(user.userPostalCode);
        await country.fill(user.userCountry);
        await submitButton.click();
    }
}
