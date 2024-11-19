import {test} from "@fixtures/Fixtures";
import {Browser, expect, Page} from "@playwright/test";
import {APIUtils} from "@utils/common/Api.utils";
import {Logger} from "@utils/common/Logger.utils";
import {UserObj} from "@interfaces/UserObject";
import {CreateRandomUser} from "@pages/CreateNewUser.page";

const logger = Logger.loggerSetup();

let user: UserObj;
let token: string;

test.beforeAll(async () => {

    user = CreateRandomUser.createRandomUser();
    token = await APIUtils.addNewUserAndGetToken(user);
    await APIUtils.createNewContact(user, token);
})
test.afterAll(async () => {
    await APIUtils.deleteUser(token);
});

test("Delete a contact.", async ({page, login, newContact}) => {
    const contactRows = page.locator(".contactTableBodyRow");
    const deleteBtn = page.locator("#delete");
    const nameCell = page.locator(".contactTableBodyRow td:nth-child(2)");
    let initialContactCount = 0;
    let laterContactNumber = 0;

    console.log("The new user: " + user.address);
    console.log()

    // Login
    await page.goto("https://thinking-tester-contact-list.herokuapp.com");
    await login.loginUser(user.email, user.password);

    await page.waitForTimeout(2000);
    logger.info(await contactRows.first().isVisible())
    initialContactCount = await nameCell.count();
    logger.info(`Number of contactRows before the delete: ${initialContactCount}`);
    await nameCell.first().click();
    page.on("dialog", async (dialog) => {
        logger.info(dialog.message());
        await dialog.accept();
    });

    await deleteBtn.click();
    await page.waitForTimeout(2000);
    laterContactNumber = await nameCell.count();
    logger.info(`Number of contactRows after the delete: ${laterContactNumber}`);
    await expect.soft(page.locator('.contactTable')).toBeVisible();
    await expect.soft(contactRows).toHaveCount(laterContactNumber);
});
