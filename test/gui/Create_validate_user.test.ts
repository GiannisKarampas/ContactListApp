import {test} from "@fixtures/Fixtures";
import {expect} from "@playwright/test";
import {CreateRandomUser} from "@pages/CreateNewUser.page";

test("Sign up with a new user, add a new contact and validate it on contact details page", async ({page, newUser, newContact}) => {
    const user = CreateRandomUser.createRandomUser();
    console.log(user)

    await page.goto("https://thinking-tester-contact-list.herokuapp.com");

    await newUser.createUser(user);
    await newContact.createNewContact(user);

    const headers = page.locator(".contactTableHead tr th");
    const cells = page.locator(".contactTableBodyRow td");

    // Validate the user on details page
    await expect.soft(headers).toHaveCount(7);
    const headersText = await headers.evaluateAll((list) => list.map((element) => element.textContent));
    expect.soft(headersText).toEqual(["Name", "Birthdate", "Email", "Phone", "Address", "City, State/Province, Postal Code", "Country"]);

    let cellsText = await cells.evaluateAll((list) => list.map((element) => element.textContent.trim()));
    cellsText.shift();
    expect.soft(cellsText).toEqual([`${user.firstName} ${user.lastName}`, user.birthdate, user.email, "", user.address, `${user.city} ${user.state} ${user.postalCode}`, user.country]);
});
