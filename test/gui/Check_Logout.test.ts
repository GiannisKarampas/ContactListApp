import {test} from "@fixtures/Fixtures"
import {expect} from "@playwright/test";
import {CreateRandomUser} from "@pages/CreateNewUser.page";

test("Check if the logout functionality is working.", async ({page, login, newContact}) => {

    await page.goto("/")
    await login.loginUser(process.env.USERNAME, process.env.PASSWORD);

    await page.locator("#logout").click();
    await expect.soft(page.getByRole("heading")).toHaveText("Contact List App")
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await page.screenshot({path: "test-results/Screenshots/LogoutPage.jpeg"})
});
