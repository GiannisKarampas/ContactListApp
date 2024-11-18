/**
 * Helper test to send bulk emails
 * With the test bellow you can send all the templates that exist in a specific folder to a certain mailbox
 * The test will wait for each template that is send to reach the first stage of Document Ingestion (Intake 100)
 * If the template can not be found in the first stage the test will fail
 * Note: Every test includes the template file name on the title so it can be identified
 */

import {test} from "@fixtures/Fixtures";
import {testData} from "@utils/common/TestDataConfig.utils";
import {emailAddress, getMsgFileNames, getEmlFileNames} from "@utils/common/EmailSender.utils";
import {failureScreenshot} from "@main/utils/common/Screenshot.utils";
import {logger} from "@main/GlobalSetup";
import {KafkaStages} from "@main/utils/enums/KafkaStages.enum";
import {EmailSender} from "@main/utils/common/EmailSender.utils";

let topic;
// The mailbox is the email address that the templates will be sent
const mailbox = emailAddress("NA_INGESTION_RC");
// The templateFolder is the folder path where all templates are located
const templateFolder = "./resources/testData/emails/";
const emailsMsg = getMsgFileNames(templateFolder);
const emailsEml = getEmlFileNames(templateFolder);

test.beforeAll(async ({kafka}) => {
    // The topic where the templates are expected to arrive, depending on the mailbox LOB that is used
    topic = kafka.topicAddress("NA_INGESTION_INTAKE");
});

test.afterEach(failureScreenshot);

emailsMsg.forEach((data) => {
    test(`Send email template ${data}`, {tag: []}, async ({kafka}, testInfo) => {
        testData.testInfo = {...testInfo};

        const date = Date.now();
        const subject = `RUSH email ${date}`;

        await EmailSender.sendEmail(data, [mailbox], subject);

        const submission_number = await kafka.getSubmissionNumberFromTopicAfterEmail(subject, topic);

        logger.info(`The Submission Number: ${submission_number}`);

        const response = await kafka.searchInTopicWithString(topic, submission_number);
        await kafka.getStageFromSubmissionNumberWithTypeMessage(response, submission_number, KafkaStages.STAGE_100, topic);
    });
});

emailsEml.forEach((data) => {
    test(`Send email template ${data}`, {tag: []}, async ({kafka}, testInfo) => {
        testData.testInfo = {...testInfo};

        const date = Date.now();
        const subject = `RUSH email ${date}`;

        await EmailSender.sendEmail(data, [mailbox], subject, "eml");

        const submission_number = await kafka.getSubmissionNumberFromTopicAfterEmail(subject, topic);

        logger.info(`The Submission Number: ${submission_number}`);

        const response = await kafka.searchInTopicWithString(topic, submission_number);
        await kafka.getStageFromSubmissionNumberWithTypeMessage(response, submission_number, KafkaStages.STAGE_100, topic);
    });
});
