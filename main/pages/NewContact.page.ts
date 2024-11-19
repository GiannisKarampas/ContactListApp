import { Page, Locator } from "@playwright/test";
import {UserObj} from "@interfaces/UserObject";

export class NewContact {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private get newContactButton(): Locator {
        return this.page.locator("#add-contact");
    }

    private get firstName(): Locator {
        return this.page.locator("#firstName");
    }

    private get lastName(): Locator {
        return this.page.locator("#lastName");
    }

    private get email(): Locator {
        return this.page.locator("#email");
    }

    private get dob(): Locator {
        return this.page.locator("#birthdate");
    }

    private get address(): Locator {
        return this.page.locator("#street1");
    }

    private get city(): Locator {
        return this.page.locator("#city");
    }

    private get state(): Locator {
        return this.page.locator("#stateProvince");
    }

    private get postalCode(): Locator {
        return this.page.locator("#postalCode");
    }

    private get country(): Locator {
        return this.page.locator("#country");
    }

    private get submitButton(): Locator {
        return this.page.locator("#submit");
    }

    private get errorMessage(): Locator {
        return this.page.locator("#error")
    }

    async createNewContact(user: UserObj): Promise<void> {
        await this.newContactButton.click();
        await this.firstName.fill(user.firstName);
        await this.lastName.fill(user.lastName);
        await this.dob.fill(user.birthdate);
        await this.email.fill(user.email.toLowerCase());
        await this.address.fill(user.address);
        await this.city.fill(user.city);
        await this.state.fill(user.state);
        await this.postalCode.fill(user.postalCode);
        await this.country.fill(user.country);
        await this.submitButton.click();
    }

    async createNewContactWithWrongDob(user: UserObj): Promise<void> {
        await this.newContactButton.click();
        await this.firstName.fill(user.firstName);
        await this.lastName.fill(user.lastName);
        await this.dob.fill("11/11/1990");
        await this.email.fill(user.email.toLowerCase());
        await this.address.fill(user.address);
        await this.city.fill(user.city);
        await this.state.fill(user.state);
        await this.postalCode.fill(user.postalCode);
        await this.country.fill(user.country);
        await this.submitButton.click();
    }
}
