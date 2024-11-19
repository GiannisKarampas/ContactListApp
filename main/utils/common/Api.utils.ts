import {test, request, Page} from "@playwright/test";
import {Logger} from "@utils/common/Logger.utils";
import {NewContact} from "@pages/NewContact.page";
import {UserObj} from "@interfaces/UserObject";

const logger = Logger.loggerSetup();
let page: Page;
const newContact = new NewContact(page);

export class APIUtils {
    constructor() {}

    // Get login token
    public static async addNewUserAndGetToken(user: UserObj): Promise<string> {
        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
        };
        const apiContext = await request.newContext();
        const loginResponse = await apiContext.post("https://thinking-tester-contact-list.herokuapp.com/users", {
            data: payload,
        });
        const loginResponseJSON = await loginResponse.json();
        const token = loginResponseJSON.token;
        logger.info(`Token of new user: ${token}`);
        return token;
    }

    // Get login token
    public static async getLoginToken(): Promise<string> {
        const loginPayload = {email: process.env.USERNAME, password: process.env.PASSWORD};
        const apiContext = await request.newContext();
        const loginResponse = await apiContext.post("https://thinking-tester-contact-list.herokuapp.com/users/login", {
            data: loginPayload,
        });
        const loginResponseJSON = await loginResponse.json();
        const token = loginResponseJSON.token;
        logger.info(`Token of existing user: ${token}`);
        return token;
    }

    // Create new contact
    public static async createNewContact(user: UserObj, token: string): Promise<void> {
        const contactPayload = {
            firstName: user.firstName,
            lastName: user.lastName,
            birthdate: user.birthdate,
            email: user.email,
            phone: "8005555555",
            street1: user.address,
            city: user.city,
            stateProvince: user.state,
            postalCode: user.postalCode,
            country: user.country,
        };

        const apiContext = await request.newContext();

        const response = await apiContext.post("https://thinking-tester-contact-list.herokuapp.com/contacts", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: contactPayload,
        });

        if (!response.ok()) {
            throw new Error(`Failed to create contact: ${response.status()} ${await response.text()}`);
        }

        const contactResponseJSON = await response.json();
        logger.info(`New contact: ${JSON.stringify(contactResponseJSON)}`);
    }

}
