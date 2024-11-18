import {test} from "../fixtures/fixtures";
import {expect} from "@playwright/test";
import {Logger} from "../utils/common/logger.utils";
import {createRandomUser} from "../utils/interfaces/userObject";

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

test("Sign up with a new user, add a new contact and validate it on contact details page", async ({page, newUser, newContact}) => {
    const headers = page.locator(".contactTableHead tr th");
    const cells = page.locator(".contactTableBodyRow td");

    // Create a new user
    await newUser.createUser(user);

    // Add new contact
    await newContact.createNewContact(user);

    // Validate the contact on details page
    await expect(headers).toHaveCount(7);
    const headersText = await headers.evaluateAll((list) => list.map((element) => element.textContent));
    expect.soft(headersText).toEqual(["Name", "Birthdate", "Email", "Phone", "Address", "City, State/Province, Postal Code", "Country"]);

    let cellsText = await cells.evaluateAll((list) => list.map((element) => element.textContent.trim()));
    cellsText.shift();
    expect.soft(cellsText).toEqual([`${user.username} ${user.userLastName}`, user.userBirthday, user.userEmail, "", user.userAddress, `${user.userCity} ${user.userState} ${user.userPostalCode}`, user.userCountry]);
});
