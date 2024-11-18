import {logger} from "@main/GlobalSetup";
import {Rest, restService} from "@main/services/Rest";
import {expect} from "@playwright/test";
import {getCurrentDateTime} from "@utils/Common.utils";
import {testData} from "@utils/common/TestDataConfig.utils";
import axios, {HttpStatusCode} from "axios";
import * as fs from "fs";
import * as path from "path";
import {Logger} from "./Logger.utils";
import {KafkaTopic, KafkaTopicQA} from "@enums/KafkaTopics.enum";
import * as enums from "@enums/KafkaTopics.enum";
import {error} from "winston";
import {KafkaStages} from "@enums/KafkaStages.enum";

const KafkaRoutes = {
    login: "/login",
    authorization: "/api/authorization",
    topics: `/api/clusters/shared-kafka-${process.env.REGION.replace("LATAM", "na").replace("EMEA", "eu").toLowerCase()}-${process.env.KAFKA_ENV.toLowerCase()}/topics`,
    messages: "/messages",
};

const KafkaTypeEvents = {
    phase: "PHASE",
    consuming: "CONSUMING",
    message: "MESSAGE",
    done: "DONE",
};

export const SeekDirection = {
    oldest: "FORWARD",
    newest: "BACKWARD",
};

const SeekType = {
    latest: "LATEST",
    oldest: "BEGINNING",
    timestamp: "TIMESTAMP",
    offset: "OFFSET",
};

/**
 * Initializes and returns a new instance of the KafkaHandler class.
 *
 * @return {Promise<KafkaHandler>} A promise that resolves to a new instance of the KafkaHandler class.
 */
export async function kafkaHandler(): Promise<KafkaHandler> {
    const kafkaHandler = new KafkaHandler();
    await kafkaHandler.init();
    return kafkaHandler;
}

export class KafkaHandler {
    private service: Rest;
    private readonly env: string;
    private readonly region: string;
    private cookie: string;
    private readonly baseUrl: string;
    private eventsResponse: any;

    constructor() {
        this.env = process.env.KAFKA_ENV.toLowerCase();
        this.region = process.env.REGION.replace("LATAM", "na").replace("EMEA", "eu").toLowerCase();
        this.baseUrl = "https://shared-kafka-" + this.region + "-" + this.env + ".chubbdigital.com/kafka-ui";
    }

    /**
     * Initializes the KafkaHandler instance by setting up the service and logging in.
     *
     * @return {Promise<KafkaHandler>} A promise that resolves to the initialized KafkaHandler instance.
     */
    public async init(): Promise<KafkaHandler> {
        this.service = await restService();
        this.cookie = await this.login();
        return this;
    }

    /**
     * Returns the address of a specific Kafka topic
     *
     * @param {string} topic - The topic, fow which the address is requested.
     * @return {string} The address of the requested topic.
     */
    public topicAddress(topic: string): string {
        enums; // enums needs to be used in any way before eval()
        const env = process.env.ENV ? process.env.ENV.toUpperCase() : "";
        const enumKafkaEnv = `KafkaTopic${env}`;
        if (enums[enumKafkaEnv] && enums[enumKafkaEnv][topic]) {
            return enums[enumKafkaEnv][topic];
        } else {
            throw new Error(`Topic ${topic} not found for environment ${env}`);
        }
    }

    /**
     * Searches for Kafka topics based on the provided search topic.
     *
     * This method sends a GET request to the Kafka UI API to retrieve a list of topics
     * that match the provided search topic. The response from the API is then exported
     * to a JSON file and the data is returned as a promise.
     *
     * @param {string} searchTopic - The topic to search for in Kafka.
     * @return {Promise<object>} A promise that resolves to the search result data.
     */
    public async searchForTopics(searchTopic: string | typeof KafkaTopic): Promise<object> {
        let url = `${this.baseUrl}${KafkaRoutes.topics}`;
        const queryParams = {
            page: 1,
            perPage: 500,
            showInternal: false,
            search: searchTopic,
        };
        const response = await this.service.getRequestWithFullUrl(url, {cookie: this.cookie}, null, queryParams);
        this.exportMessageInJsonFile(response.data);
        return response.data;
    }

    /**
     * Searches for messages in a Kafka topic based on a string value.
     *
     * This method constructs a URL based on the provided topic and search value.
     * It then sends a GET request to the Kafka UI API with the constructed URL and query parameters.
     * The response from the API is a stream of events, which is handled by the `handleKafkaEventStreamResponse` method.
     * The resulting events are stored in the `eventsResponse` property of the KafkaHandler instance.
     *
     * @param {string} topic - The name of the Kafka topic to search in.
     * @param {string} searchValue - The string value to search for.
     * @param {string | typeof SeekDirection} [seekDirection=SeekDirection.newest] - The direction to seek in. Defaults to `SeekDirection.newest`.
     * @param {number} [limit=20] - The maximum number of messages to return. Defaults to 20.
     * @return {Promise<object[]>} - A promise that resolves with an array of messages.
     */
    public async searchInTopicWithString(topic: string | typeof KafkaTopic, searchValue: string, seekDirection: string | typeof SeekDirection = SeekDirection.newest, seekType: string | typeof SeekType = SeekType.latest, limit: number = 100): Promise<object[]> {
        let url = `${this.baseUrl}${KafkaRoutes.topics}/${topic}${KafkaRoutes.messages}`;
        const queryParams = {
            q: searchValue,
            filterQueryType: "STRING_CONTAINS",
            seekDirection: seekDirection,
            seekType: seekType,
            limit: limit,
        };
        let stream = await this.service.getRequestWithFullUrl(url, {cookie: this.cookie}, null, queryParams);

        return (this.eventsResponse = this.handleKafkaEventStreamResponse(stream));
    }

    /**
     * Searches for messages in a Kafka topic based on a timestamp.
     *
     * This method constructs a URL based on the provided topic and timestamp.
     * It then sends a GET request to the Kafka UI API with the constructed URL and query parameters.
     * The response from the API is a stream of events, which is handled by the `handleKafkaEventStreamResponse` method.
     * The resulting events are stored in the `eventsResponse` property of the KafkaHandler instance.
     *
     * @param {string} topic - The name of the Kafka topic to search in.
     * @param {string} [timestamp] - The timestamp to search for. If not provided, the current timestamp will be used.
     * @param {string | typeof SeekDirection} [seekDirection=SeekDirection.newest] - The direction to seek in. Defaults to `SeekDirection.newest`.
     * @param {number} [limit=20] - The maximum number of messages to return. Defaults to 20.
     * @return {Promise<object[]>} - A promise that resolves with an array of messages.
     */
    public async searchInTopicWithTimeStamp(topic: string | typeof KafkaTopic, timestamp?: string, seekDirection: string | typeof SeekDirection = SeekDirection.newest, limit: number = 20): Promise<object[]> {
        let seekToParam = await this.createProperSeekToParameterForTimestampSearch(topic, timestamp);

        let url = `${this.baseUrl}${KafkaRoutes.topics}/${topic}${KafkaRoutes.messages}`;
        const queryParams = {
            filterQueryType: "STRING_CONTAINS",
            seekDirection: seekDirection,
            seekType: SeekType.timestamp,
            seekTo: seekToParam,
            limit: limit,
        };
        let stream = await this.service.getRequestWithFullUrl(url, {cookie: this.cookie}, null, queryParams);

        return (this.eventsResponse = this.handleKafkaEventStreamResponse(stream));
    }

    /**
     * Performs a polling search in a Kafka topic for a specified string value until the value is found or a timeout is reached.
     *
     * This method searches for a specific string value in a Kafka topic. It performs the search in a loop until the value is found or a timeout is reached.
     * The search is performed using the `searchInTopicWithString` method. If the search is successful and the returned events contain only message type events,
     * the method returns the content of these events.
     *
     * @param {string} topic - The name of the Kafka topic to search in.
     * @param {string} searchValue - The string value to search for.
     * @param {number} timeout - The maximum time to spend searching in milliseconds. Defaults to 5 minutes.
     * @param {string | typeof SeekDirection} seekDirection - The direction to seek in. Defaults to `SeekDirection.newest`.
     * @param {number} limit - The maximum number of messages to return. Defaults to 20.
     *
     * @returns {Promise<object[]>} - A promise that resolves to an array of objects containing the search results.
     *                                If the search is successful and the returned events contain only message type events,
     *                                the method returns the content of these events.
     */
    public async pollingSearchInTopicWithString(topic: string | typeof KafkaTopic, searchValue: string, timeout: number = 5 * 60 * 1000, seekDirection: string | typeof SeekDirection = SeekDirection.newest, seekType: string | typeof SeekType = SeekType.latest,limit: number = 20): Promise<object[]> {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            try {
                await this.searchInTopicWithString(topic, searchValue, seekDirection, seekType, limit);
                if (this.returnOnlyMessageTypeEvents().length > 0) {
                    return this.returnOnlyTheContentOfTheMessageTypeEvents();
                }
            } catch (error) {
                logger.error("Error in pollingSearchInTopicWithString: " + error);
            }
            await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        }
        logger.error("Timeout reached");
        return [];
    }

    /**
     * Performs a polling search in a Kafka topic for a specified timestamp until the timestamp is found or a timeout is reached.
     *
     * This method searches for a specific timestamp in a Kafka topic. It performs the search in a loop until the timestamp is found or a timeout is reached.
     * The search is performed using the `searchInTopicWithTimeStamp` method. If the search is successful and the returned events contain only message type events,
     * the method returns the content of these events.
     *
     * @param {string} topic - The name of the Kafka topic to search in.
     * @param {string} [timestamp] - The timestamp to search for. If not provided, the current timestamp will be used.
     * @param {number} timeout=5 * 60 * 1000 - The maximum time to spend searching in milliseconds. Defaults to 5 minutes.
     * @param {string | typeof SeekDirection} [seekDirection=SeekDirection.newest] - The direction to seek in. Defaults to `SeekDirection.newest`.
     * @param {number} [limit=20] - The maximum number of messages to return. Defaults to 20.
     *
     * @returns {Promise<object[]>} - A promise that resolves to an array of objects containing the search results.
     *                                If the search is successful and the returned events contain only message type events,
     *                                the method returns the content of these events.
     */
    public async pollingSearchInTopicWithTimestamp(topic: string | typeof KafkaTopic, timestamp?: string, timeout: number = 5 * 60 * 1000, seekDirection: string | typeof SeekDirection = SeekDirection.newest, limit: number = 20): Promise<object[]> {
        const startTime = Date.now();
        timestamp = timestamp || new Date().valueOf().toString();
        while (Date.now() - startTime < timeout) {
            try {
                await this.searchInTopicWithTimeStamp(topic, timestamp, seekDirection, limit);
                if (this.returnOnlyMessageTypeEvents().length > 0) {
                    return this.returnOnlyTheContentOfTheMessageTypeEvents();
                }
            } catch (error) {
                logger.error("Error in pollingSearchInTopicWithString: " + error);
            }
            await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        }
        logger.error("Timeout reached");
        return [];
    }

    /**
     * Searches for the latest messages in a Kafka topic.
     *
     * This method sends a GET request to the Kafka topic's messages endpoint to retrieve the latest messages.
     * The `seekDirection` parameter determines the direction of the search, and the `limit` parameter determines the maximum number of messages to return.
     *
     * @param {string} topic - The name of the Kafka topic to search in.
     * @param {string | typeof SeekDirection} [seekDirection=SeekDirection.newest] - The direction to seek in. Defaults to `SeekDirection.newest`.
     * @param {number} [limit=20] - The maximum number of messages to return. Defaults to 20.
     *
     * @returns {Promise<object[]>} - A promise that resolves to an array of objects containing the search results.
     */
    public async searchInTopicAllLatest(topic: string | typeof KafkaTopic, seekDirection: string | typeof SeekDirection = SeekDirection.newest, limit: number = 20): Promise<object[]> {
        let url = `${this.baseUrl}${KafkaRoutes.topics}/${topic}${KafkaRoutes.messages}`;
        const queryParams = {
            seekDirection: seekDirection,
            seekType: SeekType.latest,
            limit: limit,
        };
        let requestSpec = axios.create({responseType: "stream"});
        this.service.setupAxiosInterceptors(requestSpec);
        let stream = await this.service.getRequestWithFullUrl(url, {cookie: this.cookie}, null, queryParams);

        return (this.eventsResponse = this.handleKafkaEventStreamResponse(stream));
    }

    /**
     * Returns all events from the events response.
     *
     * This method iterates over the events response and returns an array of objects containing all events.
     * If the `log` parameter is set to `true`, it logs the events to the console.
     * Additionally, it exports the events to a JSON file named "All Events".
     *
     * @param {boolean} [log=false] - Whether to log the events to the console.
     * @returns {object[]} An array of objects containing all events.
     */
    public returnAllEvents(log?: boolean): object[] {
        const jsonArray: object[] = [];

        this.eventsResponse.forEach((element: any) => {
            jsonArray.push(element);
        });

        if (log) {
            logger.info(Logger.SEPARATOR);
            logger.info("All Events: ");
            logger.info(Logger.SEPARATOR);
            logger.info(jsonArray);
        }

        this.exportMessageInJsonFile(jsonArray, "All Events");
        return jsonArray;
    }

    /**
     * Returns an array of events of type 'message' from the events response.
     *
     * This method iterates over the events response and filters out events that are not of type 'message'.
     * If the `log` parameter is set to `true`, it logs the filtered events to the console.
     * Additionally, it exports the filtered events to a JSON file named "Only Message Types Events".
     *
     * @param {boolean} [log=false] - Whether to log the filtered events to the console.
     * @returns {object[]} An array of events of type 'message'.
     */
    public returnOnlyMessageTypeEvents(log?: boolean): object[] {
        const jsonArray: object[] = [];

        this.eventsResponse.forEach((element: {type: string}) => {
            if (element.type === KafkaTypeEvents.message) {
                jsonArray.push(element);
            }
        });

        if (log) {
            logger.info(Logger.SEPARATOR);
            logger.info("Only Message Type Events: ");
            logger.info(Logger.SEPARATOR);
            logger.info(jsonArray);
        }
        this.exportMessageInJsonFile(jsonArray, "Only Message Types Events");
        return jsonArray;
    }

    /**
     * Returns an array of objects containing the content of message type events from the events response.
     *
     * This method iterates over the events response and filters out events that are not of type 'message'.
     * For each message event, it extracts the headers and content, parses the content as JSON, and combines them into a single object.
     * If the `log` parameter is set to `true`, it logs the filtered events to the console.
     * Additionally, it exports the filtered events to a JSON file named "Content of Message Type Events".
     *
     * @param {boolean} [log=false] - Whether to log the filtered events to the console.
     * @returns {object[]} An array of objects containing the content of message type events.
     */
    public returnOnlyTheContentOfTheMessageTypeEvents(log?: boolean): object[] {
        const jsonArray: object[] = [];
        this.eventsResponse.forEach((element: {type: string; message: {content: string; headers: object}}) => {
            if (element.type === KafkaTypeEvents.message) {
                const headers = element.message.headers;
                const content = JSON.parse(element.message.content);
                const jsonObject = {headers, ...content};
                logger.info(jsonObject);
                jsonArray.push(jsonObject);
            }
        });

        if (log) {
            logger.info(Logger.SEPARATOR);
            logger.info("Content of Message Type Events: ");
            logger.info(Logger.SEPARATOR);
            logger.info(jsonArray);
        }
        this.exportMessageInJsonFile(jsonArray, "Content of Message Type Events");
        return jsonArray;
    }

    /**
     * This method iterates over the events response and filters out events that of type 'message'.
     * For each message event, it extracts the submission number and the stage
     * If the `submission number` parameter is the desired, and the `stage` is the desired, then the function is done.
     * Otherwise, the function will call itself until the process be done
     *
     * @param {object[]} response - The response object from the Kafka event stream.
     * @param {string} submission_number - The created submission number to search in the specific Kafka topic
     * @param {string} stage - The desired stage
     * @param {string} topic - Optional the Kafka topic to search in, if not given default value is docai_orchestration_qa
     * @return {Promise<string>} The stage.
     */
    public async getStageFromSubmissionNumberWithTypeMessage(response: object[], submission_number: string, stage: string, topic: string): Promise<string> {
        let counter = 0;
        return new Promise(async (resolve, reject) => {
            let stages = new Set();
            let stagesSize = 0;

            logger.info(`Search the stage ${stage} for the SN ${submission_number} in the topic ${topic}`)
            const interval = setInterval(async () => {
                try {
                    for (const result of response) {
                        let typedResult = result as {type: string; message: {content: string}};
                        if (typedResult.type === "MESSAGE") {
                            let jsonContent = JSON.parse(typedResult.message.content);
                            if (jsonContent.ingestion_context.stage === "770") {
                                throw new Error(jsonContent.ingestion_context.message);
                            }
                            stages.add(jsonContent.ingestion_context.stage);
                            if (stages.size > stagesSize) {
                                stagesSize = stages.size;
                                counter = 0;
                                logger.info(`\nSubmission ID: ${jsonContent.source_context.submission_number} \nStage: ${jsonContent.ingestion_context.stage}`);
                            }

                            if (jsonContent.source_context.submission_number === submission_number && jsonContent.ingestion_context.stage === stage) {
                                if (stage === KafkaStages.STAGE_800) {
                                    logger.info(`Extraction Completed.`);
                                } else if (stage === KafkaStages.STAGE_1200) {
                                    logger.info(`Standardization Completed.`);
                                } else if (stage === KafkaStages.STAGE_1900) {
                                    logger.info(`Completed Request for submission.`);
                                } else if (stage === KafkaStages.STAGE_2200) {
                                    logger.info(`\nSubmission completed/submitted from SDW. \nTopic: ${topic}`);
                                } else if (stage === KafkaStages.STAGE_1701) {
                                    logger.info(`\nValidation Completed. \nTopic: ${topic}`);
                                } else if (stage === KafkaStages.STAGE_1901) {
                                    logger.info(`\nCompleted Request for submission for TechRate. \nTopic: ${topic}`);
                                } else if (stage === KafkaStages.STAGE_2201) {
                                    logger.info(`\nSubmission completed/submitted from SDW for TechRate. \nTopic: ${topic}`);
                                }
                                clearInterval(interval);
                                resolve(jsonContent.ingestion_context.stage);
                            }
                        }
                    }
                    response = await this.searchInTopicWithString(topic, submission_number);
                    counter++;
                    logger.info(`Attempt: ${counter}`);
                    if (counter > 100) {
                        clearInterval(interval);
                        throw new Error("Max attempts reached");
                    }
                } catch (error) {
                    logger.error("Error during interval execution:", error);
                    clearInterval(interval);
                    reject(error);
                }
            }, 5000);
        });
    }

    /**
     * This method iterates over the events response and filters out events that of type 'message' and searching for the SN.
     *
     * @param {string} msg_subject - The subject from the email.
     * @param {string} topic - Optional the Kafka topic to search in, if not given default value is docai_orchestration_qa
     * @return {Promise<string>} The submission number.
     */
    public async getSubmissionNumberFromTopicAfterEmail(msg_subject: string, topic: string): Promise<string> {

        const responsePromise: Promise<object[]> = new Promise(async (resolve, reject) => {
            let counter = 0;

            const interval = setInterval(async () => {
                logger.info("Interval started");
                try {
                    const emailKafkaResponse = await this.searchInTopicWithString(topic, msg_subject);
                    const responseItems = emailKafkaResponse.find((item) => {
                        let typedResult = item as {type: string; message: {content: string}};
                        return typedResult?.type === "MESSAGE";
                    });
                    if (responseItems) {
                        logger.info(`Email with subject ${msg_subject} has been sent`)
                        clearInterval(interval);
                        resolve(emailKafkaResponse);
                    }
                    counter++;
                    logger.info(`Attempt: ${counter}`);
                    if (counter > 40) {
                        clearInterval(interval);
                        logger.error("Max attempts reached");
                        reject(new Error("Email has not been sent!"));
                    }
                } catch (error) {
                    logger.error("Error during interval execution: ", error);
                    clearInterval(interval);
                    reject(error);
                }
            }, 10000);

            logger.info("Interval set up");
        });

        const response = await responsePromise;
        for (const result of response) {
            let typedResult = result as {type: string; message: {content: string}};
            if (typedResult.type === "MESSAGE") {
                let jsonContent = JSON.parse(typedResult.message.content);
                if (jsonContent.source_context.email_subject === msg_subject) {
                    logger.info(`Submission ID: ${jsonContent.source_context.submission_number}`);
                    return jsonContent.source_context.submission_number;
                }
            }
        }
    }

    /**
     * This method iterates over the events response and filters out events that of type 'message' and searches the Source Reference Number.
     *
     * @param {string} topic - Optional the Kafka topic to search in, if not given default value is docai_orchestration_qa.
     * @param {string} submissionNumber - The submission number.
     * @return {Promise<string>} The Incident ID.
     */
    public async getSourceReferenceNumber(submissionNumber: string, topic: string): Promise<string> {
        const response = await this.searchInTopicWithString(topic, submissionNumber, "FORWARD", "BEGINNING");

        for (const result of response) {
            let typedResult = result as {type: string; message: {content: string}};
            if (typedResult.type === "MESSAGE") {
                let jsonContent = JSON.parse(typedResult.message.content);
                const sourceReferenceNumber = jsonContent.source_context.source_reference_number;
                logger.info(`Source Reference Number: ${sourceReferenceNumber}`);
                logger.info(`Incident ID: ${sourceReferenceNumber.split("/")[0]}`);
                return sourceReferenceNumber.split("/")[0];
            }
        }
    }

    /**
     * This method takes a response object from a Kafka event stream and extracts the JSON data from each event.
     * The response data is split into individual events by splitting on "\n\n".
     * Each event is then passed to the `extractJSONFromEvent` method to extract the JSON data.
     * If the JSON data is successfully extracted, it is added to the `jsonArray`.
     * The method returns the `jsonArray` containing the extracted JSON data from each event.
     *
     * @param {any} response - The response object from the Kafka event stream.
     * @return {object[]} An array of objects containing the extracted JSON data from each event.
     */
    private handleKafkaEventStreamResponse(response: any): object[] {
        const eventStream = response.data.toString().split("\n\n");
        const jsonArray: object[] = [];
        for (const event of eventStream) {
            const jsonData = this.extractJSONFromEvent(event);
            if (jsonData) {
                jsonArray.push(jsonData);
            }
        }
        return jsonArray;
    }

    /**
     * Extracts JSON data from an event string.
     *
     * This method takes an event string as input, trims it, and checks if it starts with "data:".
     * If it does, it extracts the JSON data by removing the "data:" prefix and any leading or trailing whitespace.
     * It then attempts to parse the JSON data using JSON.parse().
     * If the parsing is successful, it returns the parsed JSON object.
     * If the parsing fails, it logs an error message to the console and returns null.
     * If the event string does not start with "data:", it returns null.
     *
     * @param {string} event - The event string to extract JSON data from.
     * @returns {object | null} - The parsed JSON object, or null if parsing fails or the event string does not start with "data:".
     */
    private extractJSONFromEvent(event: string): object | null {
        const eventData = event.trim();
        if (eventData.startsWith("data:")) {
            const json = eventData.substring(5).trim();
            try {
                return JSON.parse(json);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }
        return null;
    }

    /**
     * This method performs a login to the Kafka service and returns the authentication cookie.
     * It sends a POST request to the login endpoint with the provided username and password.
     * The response is expected to be a redirect with a Set-Cookie header containing the authentication cookie.
     * The method then asserts that the login was successful and returns the authentication cookie.
     *
     * @return {Promise<string>} The authentication cookie.
     */
    private async login(): Promise<string> {
        const loginData = {
            username: "kafkaguest",
            password: "guest@Chubb.IO",
        };

        const loginConfig = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${this.baseUrl}${KafkaRoutes.login}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: loginData,
            maxRedirects: 0,
        };

        const loginResponse = await this.service.postRequestWithFullUrl(`${this.baseUrl}${KafkaRoutes.login}`, null, loginData, null, null, null, "application/x-www-form-urlencoded", axios.create(loginConfig));

        expect(loginResponse.status, "Kafka service status" + loginResponse.status + " " + loginResponse.statusText).toBe(HttpStatusCode.Found);

        let cookie = `${loginResponse.headers["set-cookie"][0]}; ${loginResponse.headers["set-cookie"][1]}`;

        await this.assertSuccessfulLogin(cookie);
        return cookie;
    }

    /**
     * Asserts that a login to the Kafka service was successful.
     *
     * This method sends a GET request to the authorization endpoint with the provided cookie.
     * It then asserts that the response status is OK (200) and the content type is application/json.
     *
     * @param {string} cookie - The authentication cookie obtained from a successful login.
     * @returns {Promise<void>} A promise that resolves when the assertions pass.
     */
    private async assertSuccessfulLogin(cookie: string): Promise<void> {
        let authorizationResponse = await this.service.getRequestWithFullUrl(`${this.baseUrl}${KafkaRoutes.authorization}`, {cookie: cookie});
        expect(authorizationResponse.status, "Kafka service status" + authorizationResponse.status + " " + authorizationResponse.statusText).toBe(HttpStatusCode.Ok);
        expect(authorizationResponse.headers["content-type"], "Kafka service Content-Type").toBe("application/json");
    }

    /**
     * Exports the provided message object or array to a JSON file.
     *
     * This method constructs a file path based on the test info title, region, environment, and current date/time.
     * It then writes the message object or array to the file in JSON format with indentation.
     *
     * @param {object | object[]} message - The message object or array to be exported.
     * @param {string} [name] - Optional name to be added to the file name.
     */
    private exportMessageInJsonFile(message: object | object[], name?: string): void {
        name = name ? `Kafka Response - ${name} - ` : `Kafka Response - `;
        const filePath = path.join(__dirname, "../../../resources/testData/exported/", testData.testInfo.title + " [" + process.env.REGION + " " + process.env.KAFKA_ENV + "] - " + name + getCurrentDateTime().replace(":", "_") + ".json");
        fs.writeFileSync(filePath, JSON.stringify(message, null, "\t"));
    }

    /**
     * Creates a properly formatted seekTo parameter for a timestamp search in a Kafka topic.
     *
     * This method takes a topic name and an optional timestamp as input, and returns a string
     * that can be used as the seekTo parameter in a Kafka search query. If no timestamp is
     * provided, the current timestamp is used.
     *
     * The method first retrieves the partition count for the specified topic using the
     * `searchForTopics` method. It then constructs the seekTo parameter by concatenating the
     * partition numbers and timestamps, separated by colons and commas.
     *
     * @param topic The name of the Kafka topic to search in.
     * @param timestamp The timestamp to search for. If not provided, the current timestamp will be used.
     * @returns A promise that resolves to the properly formatted seekTo parameter.
     */
    private async createProperSeekToParameterForTimestampSearch(topic: string | typeof KafkaTopic, timestamp: string): Promise<string> {
        const topicPartitions = (await this.searchForTopics(topic))["topics"][0].partitionCount;
        timestamp = timestamp || new Date().valueOf().toString();
        let seekToParam = "";
        for (let partition = 0; partition < topicPartitions; partition++) {
            seekToParam += `${partition}::${timestamp}`;
            if (partition < topicPartitions - 1) {
                seekToParam += ",";
            }
        }
        return seekToParam;
    }
}