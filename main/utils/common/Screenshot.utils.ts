import type {Page, TestInfo} from "@playwright/test";
import {getCurrentDateTime} from "@utils/Common.utils";
import * as allure from "allure-js-commons";
import * as path from "path";

export async function failureScreenshot({page}: {page: Page}, testInfo: TestInfo, jiraId?: string) {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshotPath = jiraId ? path.join(`test-results/Screenshots/${jiraId}`, `${jiraId}` + " " + getCurrentDateTime().replace(":", "_") + `.png`) : path.join(`Screenshots/${testInfo.title}` + " " + getCurrentDateTime().replace(":", "_"), `failure.png`);
        testInfo.attachments.push({name: "screenshot", path: screenshotPath, contentType: "image/png"});
        await page.screenshot({path: screenshotPath, timeout: 5000});
        await allure.attachment("search-results.png", await page.screenshot(), {
            contentType: "image/png"
        });
    }
}
