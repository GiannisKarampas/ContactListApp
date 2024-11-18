/**
 * In this file, are imported all the common classes that are mainly related on utils, such as the authentication setup and the creation of the URL.
 */

import {test as base} from "@playwright/test";
import {Authentication} from "@utils/common/Authentication.utils";
import {UrlHandler} from "@utils/common/UrlHandler.utils";
import ApiHandler from "@utils/common/ApiHandler.utils";
import {webService, WebService} from "@main/services/WebService";
import {kafkaHandler, KafkaHandler} from "@utils/common/Kafka.utils";
import {brokerHandler, BrokerApiHandler} from "@utils/common/BrokerApi.utils";

type CommonFixtures = {
    authentication: Authentication;
    urlHandler: UrlHandler;
    apiHandler: ApiHandler;
    service: WebService;
    kafka: KafkaHandler;
    broker: BrokerApiHandler;
};

export const test = base.extend<CommonFixtures>({
    /**
     * Initializes authentication and executes the provided function with the authentication instance.
     *
     * @param {object} {} - An empty object as there are no specific parameters.
     * @param {Function} use - The function to be executed with the authentication instance.
     */
    authentication: async ({}: object, use) => {
        const authentication = new Authentication();
        await use(authentication);
    },
    /**
     * Initializes the URL handler and executes the provided function with the URL handler instance.
     *
     * @param {object} {} - An empty object as there are no specific parameters.
     */
    urlHandler: async ({}: object, use) => {
        const urlHandler = new UrlHandler();
        await use(urlHandler);
    },
    /**
     * Initializes an instance of the ApiHandler class and executes the provided function with the ApiHandler instance.
     *
     * @param {object} {} - An empty object as there are no specific parameters.
     * @param {Function} use - The function to be executed with the ApiHandler instance.
     * @return {Promise<void>} - A promise that resolves when the provided function has completed execution.
     */
    apiHandler: async ({}: object, use) => {
        const apiHandler = new ApiHandler();
        await use(apiHandler);
    },
    /**
     * Initializes an instance of the WebService class and executes the provided function with the WebService instance.
     *
     * @param {object} {} - An empty object as there are no specific parameters.
     * @param {Function} use - The function to be executed with the WebService instance.
     * @return {Promise<void>} - A promise that resolves when the provided function has completed execution.
     */
    service: async ({}: object, use) => {
        const service = await webService();
        await use(service);
    },

    /**
     * Asynchronously creates a new instance of the KafkaHandler and passes it to the provided
     * `use` function.
     *
     * @param {object} _ - An empty object.
     * @param {Function} use - A function that takes the KafkaHandler instance as its argument.
     * @return {Promise<void>} A promise that resolves when the KafkaHandler instance is passed
     * to the `use` function.
     */
    kafka: async ({}, use) => {
        const kafka = await kafkaHandler();
        await use(kafka);
    },

    /**
     * Asynchronously creates a new instance of the BrokerHandler and passes it to the provided
     * `use` function.
     *
     * @param {object} _ - An empty object.
     * @param {Function} use - A function that takes the KafkaHandler instance as its argument.
     * @return {Promise<void>} A promise that resolves when the KafkaHandler instance is passed
     * to the `use` function.
     */
    broker: async ({}, use) => {
        const broker = await brokerHandler();
        await use(broker);
    },
});

export {expect} from "@playwright/test";
