import test, {expect, Locator, Page} from "@playwright/test";
import {Decorators} from "@main/utils/common/Decorators.utils";
import * as process from "node:process";
import {logger} from "@main/GlobalSetup";

const timestamp = Date.now();
const insuredName: string = `TestInsuredNameTFP_${timestamp}`;

export class SubmissionDeskWidget {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private get searchSimIncident(): Locator {
        return this.page.locator("#searchSubmissionsBox");
    }

    /**
     * Search for specific submission number in the Submission Desk Widget.
     * @param {string} submission_number
     * @param {string} lob
     * @param {string} transType - Transaction type as it is displayed in the TechRate Widget
     */
    @Decorators.step("Search Submission Number")
    async searchSubmissionNumber(submission_number: string, lob?: string, transType?: string) {
        await this.page.waitForTimeout(5000);
        await this.searchSimIncident.fill(submission_number);

        if (lob.toUpperCase() === "TFP") {
            await this.page.waitForSelector("p-table");
            await this.page.keyboard.press("Enter");
            await expect.soft(this.page.getByRole("cell", {name: `${submission_number}`}).first()).toBeVisible();
            await expect.soft(this.page.getByRole("cell", {name: transType})).toBeVisible();
            return;
        }

        await this.page.keyboard.press("Enter");
        await expect.soft(this.page.locator("#submissionsRows_searchActive")).toBeVisible();
    }

    /**
     * Assigns the reviewer user to the specific Submission number by clicking on it.
     * Clicks again the SN to open the details.
     * @param {string} submission_number
     * @param {string} user
     * @param {string} lob
     */
    @Decorators.step("Click the Submission Number")
    async clickAtSubmissionNumber(submission_number: string, user: string, lob?: string) {
        if (lob.toUpperCase() === "TFP") {
            await this.page.getByLabel("dropdown trigger").click();
            await this.page.getByPlaceholder("Search", {exact: true}).fill("svc");
            await this.page.getByLabel("Option List").getByText("SVC_DOCAIPLTFRM_TST").click();
            logger.info(`Number of submissions: ${await this.page.getByText(submission_number).count()}`);
            if ((await this.page.getByText(submission_number).count()) > 1) {
                await this.page.getByText(submission_number).last().click();
            } else {
                await this.page.getByText(submission_number).click();
            }
            await this.page.waitForSelector("(//span[normalize-space()='CUW Insured number(optional)'])[1]");
            await expect.soft(this.page.locator("(//span[normalize-space()='CUW Insured number(optional)'])[1]")).toBeVisible();
            return;
        }
        await this.page.getByText(submission_number).click();
        await expect.soft(this.page.locator("#dropdown-example")).toContainText(user);
        await this.page.getByText(submission_number).click();
        await this.page.waitForTimeout(5000);
    }
}
