import {test} from "../fixtures/fixtures";
import {expect} from "@playwright/test";
import {Logger} from "../utils/common/logger.utils";
import {createRandomUser} from "../utils/interfaces/userObject";
import {APIUtils} from "../utils/common/api.utils";

const logger = Logger.loggerSetup();
const randomUser = createRandomUser();

const user = {
    username: randomUser.firstName,
    userLastName: randomUser.lastName.toLowerCase(),
    userBirthday: "1995-06-04",
    userEmail: randomUser.email.toLowerCase(),
    userPassword: "123456789",
    userAddress: randomUser.address.toLowerCase(),
    userCity: "Thessaloniki",
    userState: "Central Macedonia",
    userPostalCode: "56429",
    userCountry: "Greece",
};

test("Delete a contact.", async ({page, login, newContact}) => {
    const contactRows = page.locator(".contactTableBodyRow");
    const deleteBtn = page.locator("#delete");
    const nameCell = page.locator(".contactTableBodyRow td:nth-child(2)");
    let initialContactCount = 0;
    let laterContactNumber = 0;

    // Login
    await login.loginUser();

    await page.waitForTimeout(2000);
    logger.info(await contactRows.first().isVisible())
    // Check if there is contact
    if (!await contactRows.first().isVisible()) {
        await APIUtils.createNewContact(user);
        await page.reload();
    }
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
