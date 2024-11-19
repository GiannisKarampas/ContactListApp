import { Page, Locator } from "@playwright/test";
import {UserObj} from "@interfaces/UserObject";

export class NewContact {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected get newContactButton(): Locator {
        return this.page.locator("#add-contact");
    }

    protected get firstName(): Locator {
        return this.page.locator("#firstName");
    }

    protected get lastName(): Locator {
        return this.page.locator("#lastName");
    }

    protected get email(): Locator {
        return this.page.locator("#email");
    }

    protected get dob(): Locator {
        return this.page.locator("#birthdate");
    }

    protected get address(): Locator {
        return this.page.locator("#street1");
    }

    protected get city(): Locator {
        return this.page.locator("#city");
    }

    protected get state(): Locator {
        return this.page.locator("#stateProvince");
    }

    protected get postalCode(): Locator {
        return this.page.locator("#postalCode");
    }

    protected get country(): Locator {
        return this.page.locator("#country");
    }

    protected get submitButton(): Locator {
        return this.page.locator("#submit");
    }

    protected get errorMessage(): Locator {
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
