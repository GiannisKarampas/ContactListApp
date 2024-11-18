import {test as base} from "@playwright/test";
import {NewContact} from "../pages/newContact.page";
type ContactFixture = {
    newContact: NewContact;
};

export const test = base.extend<ContactFixture>({
    newContact: async ({page}, use) => {
        const newContact = new NewContact(page);
        await use(newContact);
    },
});
