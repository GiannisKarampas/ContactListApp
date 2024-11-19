import {test as base} from "@playwright/test";
import { CreateUser } from "@pages/CreateNewUser.page";

type CreateUserFixture = {
    newUser: CreateUser;
}

export const test = base.extend<CreateUserFixture>({
    newUser: async ({page}, use) => {
        const newUser = new CreateUser(page);
        await use(newUser);
    }
})