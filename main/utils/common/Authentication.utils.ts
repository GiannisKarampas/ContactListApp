import {expect} from "@playwright/test";
import ApiHandler from "./ApiHandler.utils";
import {AuthEndpoints} from "@utils/apiDomain/AuthEndpoints";
import {logger} from "@main/GlobalSetup";
import {AuthResponseClass} from "@main/models/AuthResponse";
import axios, {HttpStatusCode} from "axios";

export class Authentication {
    readonly request: Request;
    private api: ApiHandler;

    constructor() {
        this.api = new ApiHandler();
    }

    /**
     * Get the username for a specific user role.
     *
     * @param role The role of the user. This is defined in roles enum
     * @returns The username string
     */
    getUsernameForRole(role: string) {
        const usernameRole = "USERNAME_" + role;
        if (process.env[usernameRole]) {
            return process.env[usernameRole];
        }
        return usernameRole;
    }

    /**
     * Get the password for a specific user role. If CYBERARKAUTH=true then it will retreive the password
     * from CyberArk instead of the config file.
     *
     * @param role The role of the user. This is defined in roles enum
     * @returns The username string
     */
    async getPasswordForRole(role: any) {
        const passwordRole = "PASSWORD_" + role;
        if (this.withCyberArkPassword()) {
            return await this.getPasswordFromCyberArk(this.getUsernameForRole(role));
        }
        return process.env[passwordRole];
    }

    private withCyberArkPassword() {
        if (process.env.CYBERARKAUTH === "true") {
            return true;
        }
        return false;
    }

    /**
     * Get user password when CyberArk is used
     *
     * @param user
     * @param request
     * @returns User String
     */
    async getPasswordFromCyberArk(user: any) {
        try {
            this.api.setUrl(process.env.CYBERARKURL + user);
            const response = await this.api.get();
            expect(response.status()).toBe(200);

            return JSON.parse(await response.text()).Content;
        } catch (error) {
            console.error(error.message);
        }
    }

    /**
     * Get the username when using custom user credentials.
     *
     * @param customUsername The custom username
     * @returns The username string
     */
    getUsernameCustom(customUsername: string) {
        return customUsername;
    }

    /**
     * Get the password when using custom user credentials.
     *
     * @param role The custom password
     * @returns The password string
     */
    getPasswordCustom(customPassword: string) {
        return customPassword;
    }

    /**
     * Retrieves a REST authentication token for the given country.
     *
     * @param {typeof Country} country - The country for which the token is requested.
     * @return {Promise<any>} A promise that resolves to the response body containing the authentication token.
     */
    public async getRestAuthToken() {
        logger.info("\x1b[36m%s\x1b[0m", "Requesting REST token for " + process.env.ENV + " environment and " + process.env.REGION + " region.");

        const response = await axios
            .post(this.buildAuthURL(), null, {
                headers: this.setupHeaders(),
                params: this.setupQueryParams()
            })
            .catch((error) => {
                logger.error(error);
                return error.response;
            });

        const responseBody = new AuthResponseClass(await response.data);

        expect(response.status === HttpStatusCode.Ok, "Response status is not 200. REST request failed.");
        expect(responseBody.accessToken.length > 0, "Access token not found. REST request failed.");

        logger.info("\x1b[36m%s\x1b[0m", "User Authenticated Successfully");
        return responseBody;
    }


    /**
     * Builds the authentication URL using a ternary operator and avoids unnecessary variable assignment.
     * Additionally, checks for null values and throws an error if they are found.
     *
     * @return {string} The correct URL for the REST authentication service
     * @throws {Error} If the environment or REST authentication URL is null
     */
    private buildAuthURL(): string {
        if (process.env.ENV === null || process.env.REST_AUTH_URL === null) {
            throw new Error("Environment or REST authentication URL is null.");
        }
        const authEndpoint =  AuthEndpoints.API_STUDIO_AUTH_PATH;
        return process.env.REST_AUTH_URL + authEndpoint;
    }

    /**
     * Setup headers for Authentication API request.
     *
     * @return {object} Headers object containing Content-Type, apiVersion, App_ID, App_Key, and RESOURCE.
     */
    private setupHeaders(): object {
        const headers =
            {
                "Content-Type": "application/json",
                apiVersion: "1",
                App_ID: process.env.APP_ID,
                App_Key: process.env.APP_KEY,
                Resource: process.env.RESOURCE
            };
        return headers;
    }

    /**
     * Sets up query parameters based on the environment.
     *
     * @return {object} The query parameters object.
     */
    private setupQueryParams(): object {
        const queryParams =
            {
                Identity: "AAD"
            };
        return queryParams;
    }
}
