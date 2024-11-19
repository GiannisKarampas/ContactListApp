import {Page, Locator} from "@playwright/test";
import {faker} from "@faker-js/faker";
import {UserObj} from "@interfaces/UserObject";

export class CreateUser {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private get email(): Locator {
        return this.page.locator("#email");
    }

    private get password(): Locator {
        return this.page.locator("#password");
    }

    private get signupButton(): Locator {
        return this.page.locator("#signup");
    }

    private get firstName(): Locator {
        return this.page.locator("#firstName");
    }

    private get lastName(): Locator {
        return this.page.locator("#lastName");
    }

    private get submitButton(): Locator {
        return this.page.locator("#submit");
    }

    async createUser(user: UserObj): Promise<void> {
        await this.signupButton.click();
        await this.firstName.fill(user.firstName);
        await this.lastName.fill(user.lastName);
        await this.email.fill(user.email.toLowerCase());
        await this.password.fill(user.password);
        await this.submitButton.click();
    }
}

export class CreateRandomUser {
    public static createRandomUser(): UserObj {
        return {
            _id: faker.string.uuid(),
            firstName: faker.person.firstName("male"),
            lastName: faker.person.lastName("male"),
            birthdate: faker.date.birthdate({min: 18, max: 70, mode: "age"}).toISOString().split("T")[0],
            email: faker.internet.email().toLowerCase(),
            password: faker.internet.password(),
            businessOrIndividual: faker.helpers.arrayElement(["Business", "Individual"]),
            company: faker.company.name(),
            phoneNumber: faker.phone.number({style: "international"}),
            country: faker.location.country(),
            state: faker.location.state(),
            city: faker.location.city(),
            address: faker.location.streetAddress(true),
            postalCode: faker.location.zipCode(),
        };
    }
}
