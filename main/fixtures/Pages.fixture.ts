/**
 * In this file, are imported all the classes that are related on Pages.
 */

import {test as base} from "@playwright/test";
import {LoginPage} from "@main/pages/Login.page";
import {SubmissionDeskWidget} from "@pages/SubmissionDeskWidget.page";
import {TechRateWidget} from "@pages/TechRate.page";

/**
 * This file extends the basic test functionality of playwright with our own pages - objects.
 * In the last export const pagesFixtures, we instantiate an object of every page and
 * we pass it to use function. This can be used inside the test cases
 * without instantiating the object inside the test.
 *
 */

type PagesFixtures = {
    loginPage: LoginPage;
    subWidget: SubmissionDeskWidget;
    techWidget: TechRateWidget;
};

export const test = base.extend<PagesFixtures>({
    loginPage: async ({page}, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    subWidget: async ({page}, use) => {
        const subWidget = new SubmissionDeskWidget(page);
        await use(subWidget);
    },

    techWidget: async ({page}, use) => {
        const techWidget = new TechRateWidget(page);
        await use(techWidget);
    },
});

export {expect} from "@playwright/test";
