import {test} from "@fixtures/Fixtures"
import {expect} from "@playwright/test";
import {CreateRandomUser} from "@pages/CreateNewUser.page";

test("Add a contact with invalid date of birth and validate the error message.", async ({page, login, newContact}) => {
    const errorMessage = page.locator("#error");
    const user = CreateRandomUser.createRandomUser();

    await page.goto("/")
    await login.loginUser(process.env.USERNAME, process.env.PASSWORD);

    await newContact.createNewContactWithWrongDob(user)

    // Check the error message
    await expect(errorMessage).toHaveText("Contact validation failed: birthdate: Birthdate is invalid");
});
