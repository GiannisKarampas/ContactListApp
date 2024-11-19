import {test as base} from "@playwright/test";
import {NewContact} from "@pages/NewContact.page";
import {ContactForm} from "@pages/ContactForm.page";
type ContactFixture = {
    newContact: NewContact;
    editContact: ContactForm
};

export const test = base.extend<ContactFixture>({
    newContact: async ({page}, use) => {
        const newContact = new NewContact(page);
        await use(newContact);
    },
    editContact: async ({page}, use) => {
        const editContact = new ContactForm(page);
        await use(editContact);
    },
});
