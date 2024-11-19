import { test } from "@fixtures/Fixtures";
import { CreateRandomUser } from "@pages/CreateNewUser.page";
import { APIUtils } from "@utils/common/Api.utils";
import { UserObj } from "@interfaces/UserObject";

let user: UserObj;
let token: string;

test.beforeAll(async () => {
    user = CreateRandomUser.createRandomUser();
    token = await APIUtils.addNewUserAndGetToken(user);

    await APIUtils.createNewContact(user, token);
});

test.afterAll(async () => {
    await APIUtils.deleteUser(token);
});

test.describe("Contact Edit Functionality", () => {

    const loginAndNavigateToContact = async (page, login) => {
        await page.goto("/");
        await login.loginUser(user.email, user.password);

        const nameCell = page.locator(".contactTableBodyRow td:nth-child(2)");
        await nameCell.first().click(); // Assuming the first contact is the one to edit
    };

    test("Edit a contact - Happy flow", async ({ page, login, editContact }) => {
        await loginAndNavigateToContact(page, login);

        await editContact.editContactWithCorrectData(user);
        await editContact.checkNewDataInContact(user);
    });

    test("Edit a contact - Put invalid data", async ({ page, login, editContact }) => {
        await loginAndNavigateToContact(page, login);

        await editContact.editContactWithInvalidData(user);
    });

});
