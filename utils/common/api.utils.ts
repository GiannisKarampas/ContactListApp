import {test, request} from "@playwright/test";
import {Logger} from "./logger.utils";
import { createContact } from "../interfaces/contactObj";

const logger = Logger.loggerSetup();

export class APIUtils {

    constructor() {
    }
    
    // Get login token
    public static async getLoginToken() {
        const loginPayload = {email: process.env.USERNAME, password: process.env.PASSWORD};
        const apiContext = await request.newContext();
        const loginResponse = await apiContext.post("https://thinking-tester-contact-list.herokuapp.com/users/login", {
            data: loginPayload,
        });
        const loginResponseJSON = await loginResponse.json();
        const token = loginResponseJSON.token;
        logger.info(token)
        return token;
    }

    // Create new contact
    public static async createNewContact(user){
        const contactPayload = createContact(user.username, user.userLastName, user.userBirthday, user.userEmail, user.userAddress, user.userCity, user.userState, user.userPostalCode, user.userCountry);
        const apiContext = await request.newContext();
        const token = await this.getLoginToken()
        const response = await apiContext.post("https://thinking-tester-contact-list.herokuapp.com/contacts",
        {
            headers: {
                Authorization : `Bearer ${token}`
            },
            data: contactPayload
        })
        const contactResponseJSON = await response.json();
        logger.info(contactResponseJSON)
    }
}