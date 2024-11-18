import {expect, request} from "@playwright/test";
import {logger} from "@main/GlobalSetup";


export default class ApiHandler {
    private baseUrl: string;

    constructor() {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    /**
     * Sample GET api call
     *
     * @returns Promise with the get content
     */
    async get(): Promise<any> {
        try {
            return await (await request.newContext()).get(this.baseUrl);
        } catch (error) {
            logger.error(error.message);
        }
    }

    /**
     * Sample POST api call
     *
     * @param data Json format with different options
     * @returns Promise
     */
    async post(data: any) {
        try {
            return await (await request.newContext()).post(this.baseUrl, data);
        } catch (error) {
            logger.error(error.message);
        }
    }

    /**
     * Sample PUT api call
     *
     * @param data Json format with different options
     * @returns
     */
    async put(data: any) {
        try {
            return await (await request.newContext()).put(this.baseUrl, data);
        } catch (error) {
            logger.error(error.message);
        }
    }

    /**
     * Sample DELETE api call
     *
     * @returns Promise
     */
    async delete() {
        try {
            const response = (await request.newContext()).delete(this.baseUrl);
            expect((await response).ok()).toBeTruthy();
        } catch (error) {
            logger.error(error.message);
        }
    }

    /**
     * This should be called to set the url of the API
     *
     * @param url String
     */
    setUrl(url: string) {
        this.baseUrl = url;
    }
}
