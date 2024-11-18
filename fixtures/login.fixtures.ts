import {test as base} from "@playwright/test";
import {LoginPage} from "../pages/login.page";

type LoginFixture = {
    login: LoginPage;
};

export const test = base.extend<LoginFixture>({
    login: async ({page}, use) => {
        const login = new LoginPage(page);
        await use(login);
    },
});
