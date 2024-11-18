import {test} from "@fixtures/Fixtures";
import {failureScreenshot} from "@utils/common/Screenshot.utils";
import {getTestCaseJiraId, testData} from "@utils/common/TestDataConfig.utils";
import {allure} from "allure-playwright";
import * as path from "path";

require("dotenv").config();
const dataFilePath = path.join(__dirname, "../../resources/testData/properties", "TestSuite1.json");
//test.use({storageState: `./utils/auth/authToken.${process.env.CONFIG}.SUPERADMIN.json`});
test.afterEach(failureScreenshot);

test.describe("Test Suite 1", () => {
    test("Test Case Test Data Config", {tag: "@JIRAPROJID-XXXXX"}, async ({loginPage, urlHandler}, testInfo) => {
        testData.testInfo = {...testInfo, file: dataFilePath};
        await allure.link("https://jira.chubb.com/browse/JIRAPROJID-XXXXX", "Test Case Link");
        await allure.subSuite("[" + getTestCaseJiraId() + "] " + testData.testInfo.title);
        test.setTimeout(0);

        await loginPage.navigate(urlHandler.createUrlBasedOnRegionsAndCountries(process.env.CONFIG));

        await loginPage.loginWithTestDataConfig();
        await loginPage.verifyInvalidLoginMessage();

        await loginPage.loginWithTestDataConfig(1);
        await loginPage.verifyInvalidLoginMessage(1);
    });
});
