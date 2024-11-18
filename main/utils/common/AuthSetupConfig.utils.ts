import * as fs from "fs";
import {Browser, chromium, Page} from "@playwright/test";
import {Authentication} from "./Authentication.utils";
import {LoginPage} from "@main/pages/Login.page";
import {UrlHandler} from "@utils/common/UrlHandler.utils";
import {role} from "@enums/User.role.enum";
import {logger} from "@main/GlobalSetup";

let page: Page;
let browser: Browser;

export class AuthSetupConfig {
    /**
     * Function that receives a string of users, creates the roles based on the values are given through .config file or command line, and returns
     * an array with the roles.
     * @returns
     */
    async createRolesAndUsers() {
        let user: string;
        let rolesArray: string[] = [];
        let roles: string[] = [];
        let index = 0;

        user = process.env.USERS;

        if (user.includes(",")) {
            rolesArray = user.split(",");
            rolesArray.forEach((values) => {
                roles[index] = role[values] as role;
                index++;
            });
        } else {
            roles.push(role[user] as role);
        }
        return roles;
    }

    /**
     * Function that checks if the storage file exists. Based on the returned value, the authentication setup is triggered
     * @param user
     * @returns true | false
     */
    async shouldSetupStorageState(user: any) {
        const authStorageFile = `./main/utils/auth/authToken.${process.env.CONFIG}.${user}.json`;
        if (!fs.existsSync(authStorageFile)) {
            logger.info(`Storage State for the user ${user} does not exist.`);
            return true;
        }

        return await this.storageStateIsExpired(authStorageFile, user);
    }

    /**
     * Function that checks if the cookie is expired. Returns true in case the cookie has been expired.
     * @param authStorageFile
     * @param user
     * @returns
     */
    private async storageStateIsExpired(authStorageFile: string, user: any) {
        let expiresTimestamp = 0;
        let authFile: any;
        let authJson: any;

        logger.info(`Storage State for the user ${user} exists.`);
        try {
            authFile = await fs.readFileSync(authStorageFile, "utf-8");
            authJson = await JSON.parse(authFile);
        } catch (error) {
            logger.error(error);
        }

        for (let i = 0; i < authJson.cookies.length; i++) {
            if (authJson.cookies[i].name === process.env.COOKIE) {
                expiresTimestamp = authJson.cookies[i].expires;
                break;
            }
        }

        var expiredTime = new Date(expiresTimestamp * 1000);
        var currentTime = new Date();

        logger.info(`Storage state for ${user} expires in: ${expiredTime}`);
        logger.info(`System current time: ${currentTime}`);

        if (currentTime > expiredTime) {
            logger.info(`Storage state for the user ${user} exists but it has been expired.`);
            return true;
        }
    }

    /**
     * Function that creates the storage state file for specific user
     * @param user
     */
    async setupAuthStorageStateFileForUser(user: string) {
        browser = await chromium.launch({headless: false});
        const context = await browser.newContext();        
        page = await context.newPage();
        
        let loginPage: LoginPage = new LoginPage(page);
        let authentication: Authentication = new Authentication();
        let urlHandler: UrlHandler = new UrlHandler();

        const authFile = `./main/utils/auth/authToken.${process.env.CONFIG}.${user}.json`;

        await loginPage.navigate(urlHandler.getUrlForEnvironment(process.env.CONFIG));
        await loginPage.login(authentication.getUsernameForRole(user), await authentication.getPasswordForRole(user));
        await page.waitForLoadState("domcontentloaded");

        await page.context().storageState({path: authFile});
        await page.close();
    }
}
