import {ContextData} from "@main/models/ContextData";
import {Rest, restService} from "@main/services/Rest";
import {Soap, soapService} from "@main/services/Soap";
import {logger} from "@main/GlobalSetup";
import {Logger} from "@utils/common/Logger.utils";
import {formatJson, formatXml} from "@utils/Common.utils";


export async function webService(): Promise<WebService> {
    const webService = new WebService();
    await webService.init();
    return webService;
}

export class WebService {

    private contextData: ContextData;
    private _rest: Rest;
    private _soap: Soap;

    constructor() {
        this.contextData = new ContextData();
    }

    /**
     * Initializes the WebService by calling the restService and soapService functions.
     *
     * @return {Promise<WebService>} The initialized WebService instance.
     */
    public async init(): Promise<WebService> {
        this._rest = await restService();
        this._soap = await soapService();
        return this;
    }

    /**
     * Returns the context data.
     *
     * @return {ContextData} The context data.
     */
    get context(): ContextData {
        return this.contextData;
    }

    /**
     * Returns the rest service.
     *
     * @return {Rest} The rest service.
     */
    get rest(): Rest {
        return this._rest;
    }

    /**
     * Returns the SOAP service.
     *
     * @return {Soap} The SOAP service.
     */
    get soap(): Soap {
        return this._soap;
    }

}

/**
 * Logs the details of an HTTP request.
 *
 * @param {any} config - The configuration object for the request.
 * @param {object} [maskedHeaders] - Optional object containing headers to be masked in the log.
 * @return {any} The original request configuration object.
 */
export function logRequest(config: any, maskedHeaders?: object): any {
    logger.info(Logger.SEPARATOR);
    logger.info("Request Method: " + config.method.toUpperCase());
    logger.info(Logger.SEPARATOR);
    logger.info("Request URL: " + config.url);
    logger.info(Logger.SEPARATOR);
    logger.info("Request Headers: " + formatJson(maskedHeaders || config.headers));
    logger.info(Logger.SEPARATOR);
    if (config.params) {
        logger.info(Logger.SEPARATOR);
        logger.info("Request Query Parameters: " + formatJson(config.params));
        logger.info(Logger.SEPARATOR);
    }
    if (config.data) {
        logger.info(Logger.SEPARATOR);
        logger.info("Request Payload: " + formatJson(config.data));
        logger.info(Logger.SEPARATOR);
    }
    return config;
}

/**
 * Logs the response details to the logger based on the type of request.
 *
 * @param {any} response - The response object containing details about the response.
 * @param {"Rest" | "Soap"} type - The type of the request (Rest or Soap).
 * @return {any} The original response object.
 */
export function logResponse(response: any, type: "Rest" | "Soap"): any {
    logger.info(Logger.SEPARATOR);
    logger.info("Response Status Code: " + response.status + " - " + response.statusText);
    logger.info(Logger.SEPARATOR);
    logger.info("Response Headers: " + response.headers);
    logger.info(Logger.SEPARATOR);
    logger.info("Response Body: " + (type === "Rest" ? formatJson(response.data) : formatXml(response.data)));
    logger.info(Logger.SEPARATOR);
    return response;
}

/**
 * Logs the error details and response information to the logger.
 *
 * @param {any} error - The error object containing details about the error.
 * @param {"Rest" | "Soap"} type - The type of the request that resulted in the error.
 * @return {any} The response object from the error.
 */
export function logError(error: any, type: "Rest" | "Soap"): any {
    if (!error.response) {
        logger.error(Logger.SEPARATOR);
        logger.error("Error code:" + error.code);
        logger.error("Error message:" + error.message);
        logger.error("Error stack trace:" + error.stackTrace);
    }
    logger.error(Logger.SEPARATOR);
    logger.error("Error Response Status Code: " + error.response.status + " - " + error.response.statusText);
    logger.error(Logger.SEPARATOR);
    logger.error("Error Response Headers: " + error.response.headers);
    logger.error(Logger.SEPARATOR);
    logger.error("Error Response Body: " + (type === "Rest" ? formatJson(error.response.data) : formatXml(error.response.data)));
    logger.error(Logger.SEPARATOR);
    return error.response;
}
