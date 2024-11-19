import {test} from "@fixtures/Fixtures"
import {expect} from "@playwright/test";
import {CreateRandomUser} from "@pages/CreateNewUser.page";
import {UserObj} from "@interfaces/UserObject";
import {APIUtils} from "@utils/common/Api.utils";

let user: UserObj;

test.beforeAll(async () => {

    user = CreateRandomUser.createRandomUser();
    await APIUtils.addNewUserAndGetToken(user);
})

test("Add a contact with invalid date of birth and validate the error message.", async ({page, login, newContact}) => {
    const errorMessage = page.locator("#error");

    await page.goto("/")
    await login.loginUser(user.email, user.password);

    await newContact.createNewContactWithWrongDob(user)

    // Check the error message
    await expect(errorMessage).toHaveText("Contact validation failed: birthdate: Birthdate is invalid");
});
