import test, {expect, Locator, Page} from "@playwright/test";
import {Decorators} from "@main/utils/common/Decorators.utils";
import * as process from "node:process";
import {logger} from "@main/GlobalSetup";

const timestamp = Date.now();
const insuredName: string = `TestInsuredNameTFP_${timestamp}`;

export class TechRateWidget {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private get searchSimIncident(): Locator {
        return this.page.locator("#searchSubmissionsBox");
    }

    private get ownershipDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[1]");
    }

    private get segmentDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[2]");
    }

    private get formTypeDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[3]");
    }

    private get insuredNameField(): Locator {
        return this.page.locator("(//input[@type='text'])[7]");
    }

    private get trimmedInsuredNameField(): Locator {
        return this.page.locator("(//input[@type='text'])[8]");
    }

    private get insuredAddressField(): Locator {
        return this.page.locator("(//input[@type='text'])[12]");
    }

    private get insuredAddress2Field(): Locator {
        return this.page.locator("(//input[@type='text'])[13]");
    }

    private get insuredCityField(): Locator {
        return this.page.locator("(//input[@type='text'])[15]");
    }

    private get insuredAddressStateDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[4]");
    }

    private get insuredZipCodeField(): Locator {
        return this.page.locator("(//input[@type='text'])[16]");
    }

    private get agencyNameField(): Locator {
        return this.page.locator("(//input[@type='text'])[17]");
    }

    private get legacyChubbProducerCodeField(): Locator {
        return this.page.locator("(//input[@type='text'])[18]");
    }

    private get producerCodeField(): Locator {
        return this.page.locator("(//input[@type='text'])[19]");
    }

    private get producerSubCodeField(): Locator {
        return this.page.locator("(//input[@type='text'])[20]");
    }

    private get producingBranchDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[5]");
    }

    private get agencyAddressField(): Locator {
        return this.page.locator("(//input[@type='text'])[21]");
    }

    private get agencyCityField(): Locator {
        return this.page.locator("(//input[@type='text'])[22]");
    }

    private get agencyAddressStateDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[6]");
    }

    private get agencyZipCodeField(): Locator {
        return this.page.locator("(//input[@type='text'])[23]");
    }

    private get brokerEmailField(): Locator {
        return this.page.locator("(//input[@type='text'])[26]");
    }

    private get clearanceProcessorNameField(): Locator {
        return this.page.locator("(//input[@type='text'])[31]");
    }

    private get policiesTab(): Locator {
        return this.page.getByRole("tab", {name: "Policies"});
    }

    private get policyDeleteButton(): Locator {
        return this.page.locator("(//span[contains(text(),'Delete')])[2]");
    }

    private get policyGeneralButton(): Locator {
        return this.page.getByRole("button", {name: "General (Policy-1)"});
    }

    private get systemDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[7]");
    }

    private get normalizedProductField(): Locator {
        return this.page.locator("(//input[@type='text'])[32]");
    }

    private get termDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[8]");
    }

    private get customerGroupDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[9]");
    }

    private get productDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[10]");
    }

    private get datePicker(): Locator {
        return this.page.locator("p-calendar").filter({hasText: "Expiration date"}).getByLabel("Choose Date");
    }

    private get nextMonthButton(): Locator {
        return this.page.getByLabel("Next Month");
    }

    private get selectedDateButton(): Locator {
        return this.page.locator("(//span[normalize-space()='10'])[1]");
    }

    private get policyTypeDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[11]");
    }

    private get serviceAreaDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[12]");
    }

    private get serviceBranchDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[13]");
    }

    private get statusDropdown(): Locator {
        return this.page.locator("(//span[@id='#selectChoiceBeta'])[14]");
    }

    private get uwEmailField(): Locator {
        return this.page.locator("(//input[@type='text'])[35]");
    }

    private get uwFirstNameField(): Locator {
        return this.page.locator("(//input[@type='text'])[36]");
    }

    private get uwLastNameField(): Locator {
        return this.page.locator("(//input[@type='text'])[37]");
    }

    private get uaEmailField(): Locator {
        return this.page.locator("(//input[@type='text'])[38]");
    }

    private get uaFirstNameField(): Locator {
        return this.page.locator("(//input[@type='text'])[39]");
    }

    private get uaLastNameField(): Locator {
        return this.page.locator("(//input[@type='text'])[40]");
    }

    private get saveButton(): Locator {
        return this.page.locator("(//button[@label='Save'])[1]");
    }

    private get submitButton(): Locator {
        return this.page.locator("(//button[@label='Submit'])");
    }

    async fillFieldsForInsuredInTfpSubWidget() {
        await this.ownershipDropdown.click();
        await this.page.getByRole("option", {name: "Private"}).click();

        await this.segmentDropdown.click();
        await this.page.getByRole("option", {name: "Private Companies"}).click();

        await this.formTypeDropdown.click();
        await this.page.getByRole("option", {name: "Private"}).click();

        await this.insuredNameField.fill(`${insuredName}, Inc.`);

        await this.trimmedInsuredNameField.fill(insuredName);

        await this.insuredAddressField.fill("21 Progress St");

        await this.insuredAddress2Field.clear();

        await this.insuredCityField.fill("New York");

        await this.insuredAddressStateDropdown.click();
        await this.page.getByRole("option", {name: "NY"}).click();

        await this.insuredZipCodeField.fill("10016");
    }

    async fillFieldsForProducerInTfpSubWidget() {
        await this.agencyNameField.fill("AP DESIGN PROFESSIONALS INSUR");

        await this.legacyChubbProducerCodeField.fill("0011396");

        await this.producerCodeField.fill("0011396");

        await this.producerSubCodeField.fill("99999");

        await this.producingBranchDropdown.click();
        await this.page.getByRole("option", {name: "MLW"}).click();

        await this.agencyAddressField.fill("3697 MT DIABLO BLVD 230");

        await this.agencyCityField.fill("LAFAYETTE");

        await this.agencyAddressStateDropdown.click();
        await this.page.getByRole("option", {name: "CA"}).first().click();

        await this.agencyZipCodeField.fill("94549");

        if (!(await this.page.locator("(//span[@class='cb-radio__icon-container'])[4]").isChecked())) {
            await this.page.locator("(//span[@class='cb-radio__icon-container'])[4]").click({clickCount: 2});
        }

        await this.brokerEmailField.fill("ioannis.karampatzakis@chubb.com");
    }

    async fillFieldsForProcessingInTfpSubWidget() {
        await this.page.getByRole("tab", {name: "Processing"}).click();
        await this.clearanceProcessorNameField.fill(process.env.USERNAME_ADMIN);
    }

    async addPolicyInTfpDubWidget() {
        await this.page.getByRole("tab", {name: "Policies"}).click();
        let policies = this.page.locator("(//p-tabpanel[@class='p-element ng-star-inserted'])[3]/div/lib-renderer-container");

        while ((await policies.count()) > 1) {
            await this.page.locator("(//span[contains(text(),'Delete')])[2]").click();
            policies = this.page.locator("(//p-tabpanel[@class='p-element ng-star-inserted'])[3]/div/lib-renderer-container");
            await policies.count();
        }

        await this.page.getByRole("button", {name: "General (Policy-1)"}).click();

        await this.systemDropdown.click();
        await this.page.getByRole("option", {name: "FLDC, CUW, Genius"}).click();

        await this.normalizedProductField.fill("Fiduciary Liability");

        await this.termDropdown.click();
        await this.page.getByRole("option", {name: "1 years"}).click();

        await this.customerGroupDropdown.click();
        await this.page.getByRole("option", {name: "EP3"}).click();

        await this.productDropdown.click();
        await this.page.getByRole("option", {name: "FL- Private/Not for Profit"}).click();

        if (await this.page.locator("p-calendar").filter({hasText: "Expiration date"}).getByLabel("Choose Date").isVisible()) {
            const datePicker = this.page.locator("p-calendar").filter({hasText: "Expiration date"}).getByLabel("Choose Date");
            const nextMonthButton = this.page.getByLabel("Next Month");
            const selectedDateButton = this.page.locator("(//span[normalize-space()='10'])[1]");
            await datePicker.click();
            await nextMonthButton.click();
            await selectedDateButton.click();
        }

        await this.policyTypeDropdown.click();
        await this.page.getByRole("option", {name: "FL TFP"}).click();

        await this.serviceAreaDropdown.click();
        await this.page.getByRole("option", {name: "EP3"}).click();

        await this.serviceBranchDropdown.click();
        await this.page.getByRole("option", {name: "LAO"}).click();

        await this.statusDropdown.click();
        await this.page.locator("(//span[@class='ng-star-inserted'][normalize-space()='Submission'])[1]").click();

        await this.uwEmailField.fill("ioannis.karampatzakis@chubb.com");

        await this.uwFirstNameField.fill("Giannis");

        await this.uwLastNameField.fill("Test");

        await this.uaEmailField.fill("ioannis.karampatzakis@chubb.com");

        await this.uaFirstNameField.fill("Giannis");

        await this.uaLastNameField.fill("Test");
    }

    async saveAndValidateTechRateSubWidget(submission_number: string) {
        await this.saveButton.click();
        await this.page.waitForSelector("(//div[@class='toast-message-content'])[1]");
        await expect.soft(this.page.locator("(//div[@class='toast-message-content'])[1]")).toContainText(`Transaction ${submission_number} has been updated`);
    }

    async submitAndValidateTechRateSubWidget(submission_number: string) {
        await this.page.waitForTimeout(3000);
        await this.submitButton.click();
        if ((await this.page.locator("(//div[@class='cb-inline-alert__content'])[1]").count()) > 0) {
            const errors: string[] = [];
            for (let i = 0; i < (await this.page.locator("(//div[@class='cb-inline-alert__content'])[1]").count()); i++) {
                logger.info(await this.page.locator("(//span[@class='cb-inline-alert__alert-summary ng-star-inserted'])[1]").inputValue());
                errors.push(await this.page.locator("(//span[@class='cb-inline-alert__alert-summary ng-star-inserted'])[1]").inputValue());
            }

            throw new Error(errors.toString());
        }

        await this.page.waitForTimeout(5000);
        await this.page.waitForSelector("(//div[@class='toast-message-content'])[1]");
        await expect.soft(this.page.locator("(//div[@class='toast-message-content'])[1]")).toContainText(`Transaction ${submission_number} is complete.`);
        await this.page.waitForSelector("(//div[@class='toast-message-detail'])[1]");
        await expect.soft(this.page.locator("(//div[@class='toast-message-detail'])[1]")).toContainText(`Transaction ${submission_number} is complete.`);
    }

    async checkStatusInTechRateSubWidgetForSubmission(submission_number: string, status: string) {
        await this.page.waitForTimeout(5000);
        await this.searchSimIncident.fill(submission_number);
        await this.page.keyboard.press("Enter");
        logger.info(`Number of submissions: ${await this.page.getByText(submission_number).count()}`);
        if ((await this.page.getByText(submission_number).count()) > 1) {
            await expect.soft(this.page.locator("(//section[@class='review-table-tag'])[1]")).toContainText(` ${status} `);
            await expect.soft(this.page.locator("(//section[@class='review-table-tag'])[1]")).toHaveText(` ${status} `);
        } else {
            await expect.soft(this.page.locator("(//section[@class='review-table-tag'])[2]")).toContainText(` ${status} `);
            await expect.soft(this.page.locator("(//section[@class='review-table-tag'])[2]")).toHaveText(` ${status} `);
        }
    }

    async checkFieldsForInsuredInTfpSubWidget() {
        await expect.soft(this.ownershipDropdown).toHaveText("Private");

        await expect.soft(this.segmentDropdown).toHaveText("Private Companies");

        await expect.soft(this.formTypeDropdown).toHaveText("Private");

        expect.soft(await this.insuredNameField.inputValue()).toEqual(`${insuredName}, Inc.`);

        expect.soft(await this.trimmedInsuredNameField.inputValue()).toEqual(insuredName);

        expect.soft(await this.insuredAddressField.inputValue()).toEqual("21 Progress St");

        expect.soft(await this.insuredCityField.inputValue()).toEqual("New York");

        await expect.soft(this.insuredAddressStateDropdown).toHaveText("NY");

        expect.soft(await this.insuredZipCodeField.inputValue()).toEqual("10016");
    }

    async checkFieldsForProducerInTfpSubWidget() {
        const agencyNameField = await this.page.locator("(//input[@type='text'])[17]").inputValue();
        expect.soft(agencyNameField).toEqual("AP DESIGN PROFESSIONALS INSUR");

        const legacyChubbProducerCodeField = await this.page.locator("(//input[@type='text'])[18]").inputValue();
        expect.soft(legacyChubbProducerCodeField).toEqual("0011396");

        const producerCodeField = await this.page.locator("(//input[@type='text'])[19]").inputValue();
        expect.soft(producerCodeField).toEqual("0011396");

        const producerSubCodeField = await this.page.locator("(//input[@type='text'])[20]").inputValue();
        expect.soft(producerSubCodeField).toEqual("99999");

        const producingBranchDropdown = this.page.locator("(//span[@id='#selectChoiceBeta'])[5]");
        await expect.soft(producingBranchDropdown).toHaveText("MLW");

        const agencyAddressField = await this.page.locator("(//input[@type='text'])[21]").inputValue();
        expect.soft(agencyAddressField).toEqual("3697 MT DIABLO BLVD 230");

        const agencyCityField = await this.page.locator("(//input[@type='text'])[22]").inputValue();
        expect.soft(agencyCityField).toEqual("LAFAYETTE");

        const agencyAddressStateDropdown = this.page.locator("(//span[@id='#selectChoiceBeta'])[6]");
        await expect.soft(agencyAddressStateDropdown).toHaveText("CA");

        const agencyZipCodeField = await this.page.locator("(//input[@type='text'])[23]").inputValue();
        expect.soft(agencyZipCodeField).toEqual("94549");

        await expect.soft(this.page.locator("(//span[@class='cb-radio__icon-container'])[4]")).toBeChecked();

        const brokerEmailField = await this.page.locator("(//input[@type='text'])[26]").inputValue();
        expect.soft(brokerEmailField).toEqual("ioannis.karampatzakis@chubb.com");
    }

    async checkFieldsForProcessingInTfpSubWidget(incident_number: string) {
        await this.page.getByRole("tab", {name: "Processing"}).click();

        const simIncidentNumberField = await this.page.locator("(//input[@type='text'])[27]").inputValue();
        expect.soft(simIncidentNumberField).toEqual(incident_number);

        const clearanceProcessorNameField = await this.page.locator("(//input[@type='text'])[29]").inputValue();
        expect.soft(clearanceProcessorNameField).toEqual(process.env.USERNAME_ADMIN);
    }

    async checkPolicyInTfpDubWidget() {
        await this.page.getByRole("tab", {name: "Policies"}).click();

        await this.page.getByRole("button", {name: "General (Policy-1)"}).click();

        await expect.soft(this.systemDropdown).toHaveText("FLDC, CUW, Genius");

        expect.soft(await this.normalizedProductField.inputValue()).toEqual("Fiduciary Liability");

        await expect.soft(this.termDropdown).toHaveText("1 years");

        await expect.soft(this.customerGroupDropdown).toHaveText("EP3");

        await expect.soft(this.productDropdown).toHaveText("FL- Private/Not for Profit");

        await expect.soft(this.policyTypeDropdown).toHaveText("FL TFP");

        await expect.soft(this.serviceAreaDropdown).toHaveText("EP3");

        await expect.soft(this.serviceBranchDropdown).toHaveText("LAO");

        await expect.soft(this.statusDropdown).toHaveText("Submission");

        const uwEmailField = this.page.locator("(//input[@type='text'])[36]");
        await expect.soft(uwEmailField).toHaveText("ioannis.karampatzakis@chubb.com");

        const uwFirstNameField = await this.page.locator("(//input[@type='text'])[37]").inputValue();
        expect.soft(uwFirstNameField).toEqual("Giannis");

        const uwLastNameField = await this.page.locator("(//input[@type='text'])[38]").inputValue();
        expect.soft(uwLastNameField).toEqual("Test");

        const uaEmailField = await this.page.locator("(//input[@type='text'])[39]").inputValue();
        expect.soft(uaEmailField).toEqual("ioannis.karampatzakis@chubb.com");

        const uaFirstNameField = await this.page.locator("(//input[@type='text'])[40]").inputValue();
        expect.soft(uaFirstNameField).toEqual("Giannis");

        const uaLastNameField = await this.page.locator("(//input[@type='text'])[41]").inputValue();
        expect.soft(uaLastNameField).toEqual("Test");

        await this.page.getByRole("button", {name: "ForeFront essentials"}).click();

        const controlNumberField = this.page.locator("(//input[@type='text'])[42]");
        await controlNumberField.fill("09335397");
    }
}
