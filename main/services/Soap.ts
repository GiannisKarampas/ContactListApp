import {ContextData} from "@main/models/ContextData";
import axios, {AxiosInstance, AxiosResponse, Method} from "axios";
import * as https from "https";
import * as process from "node:process";
import {logger} from "@main/GlobalSetup";
import {SoapEndpoints} from "@utils/apiDomain/SoapEndpoints";
import {SoapActions} from "@utils/apiDomain/SoapActions";
import {logError, logRequest, logResponse} from "@main/services/WebService";

/**
 * Initializes the SOAP service by creating a new instance of the SOAP class,
 * initializing it, and returning it.
 *
 * @return {Promise<Soap>} A promise that resolves to the initialized SOAP instance.
 */
export async function soapService(): Promise<Soap> {
    return new Soap();
}

export class Soap {
    public static readonly SOAP_CONTENT_TYPE: string = "application/soap+xml; charset=utf-8";
    private contextData: ContextData;
    private requestSpec: AxiosInstance;


    constructor() {
        this.contextData = new ContextData();
        this.requestSpec = this.getRequestSpec();
        this.setupAxiosInterceptors();
    }

    /**
     * Returns the context data.
     *
     * @return {ContextData} The context data.
     */
    public context(): ContextData {
        return this.contextData;
    }

    /**
     * Sends a POST request to the specified basePath and route with the given body, pathParams, queryParams, and file (if provided).
     *
     * @param {string | typeof SoapEndpoints} basePath - The base path for the request.
     * @param soapAction
     * @param {any} body - The body of the request.
     * @param requestSpec
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse of the request.
     */
    public async postRequest(basePath: string | typeof SoapEndpoints,
                             soapAction: string | typeof SoapActions,
                             body: any,
                             requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequest("POST", basePath, soapAction, body, requestSpec);
    }

    /**
     * Creates a request specification for making HTTP requests to the SOAP API.
     *
     * @return {Promise<AxiosInstance>} A promise that resolves to an Axios instance with the request specification.
     */
    private getRequestSpec(): AxiosInstance {
        return axios.create({
            baseURL: process.env.SOAP_BASE_URL,
            headers: {
                "Content-Type": Soap.SOAP_CONTENT_TYPE,
                "Accept": "application/xml"
            },
            insecureHTTPParser: true,
            httpsAgent: new https.Agent({rejectUnauthorized: false})
        });
    }

    /**
     * Sends a request to the specified endpoint with the provided method, body, and parameters.
     *
     * @param {Method} method - The HTTP method for the request.
     * @param {string | typeof SoapEndpoints} basePath - The base path of the request.
     * @param soapAction
     * @param {any} body - The request body.
     * @param requestSpec
     * @return {Promise<AxiosResponse>} A promise that resolves to the response of the request.
     */
    private async sendRequest(method: Method,
                              basePath: string | typeof SoapEndpoints,
                              soapAction: string | typeof SoapActions,
                              body: any,
                              requestSpec = this.requestSpec): Promise<AxiosResponse> {

        const request = requestSpec;

        const startTime = performance.now();

        let url = request.defaults.baseURL + basePath;

        if (basePath.toString().startsWith("http")) {
            request.defaults.baseURL = "";
            url = basePath.toString();
        }

        // Set up the request config
        const config = {
            method,
            url,
            data: body,
            headers: {
                "SOAPAction": soapAction.toString()
            },
            startTime: startTime
        };

        let response: AxiosResponse;
        try {
            response = await request.request(config);
        } catch (error) {
            response = await error.response;
        }

        const endTime = performance.now();
        const responseTime = endTime - startTime;
        logger.info(`Response Duration: ${responseTime.toFixed(2)} ms`);
        this.setContextData(response, responseTime);
        return response;
    }

    /**
     * Sets the last response and response time in the context data object.
     *
     * @param {AxiosResponse} response - The Axios response object.
     * @param {number} responseTime - The time taken for the response in milliseconds.
     */
    private setContextData(response: AxiosResponse, responseTime: number) {
        this.contextData.lastResponse = response;
        this.contextData.responseTime = responseTime;
    }

    /**
     * Sets up Axios interceptors to log request and response details.
     * The request interceptor logs the request method, URL, headers, and payload.
     * The response interceptor logs the response status code, status text, and response body.
     * Additionally, it logs the response duration in milliseconds.
     * If an error occurs during the request, it logs the error details.
     */
    private setupAxiosInterceptors() {
        logger.info("Setup Axios Interceptors");

        this.requestSpec.interceptors.request.use((config) => {
            return this.logRequest(config);
        });

        this.requestSpec.interceptors.response.use(
            (response) => {
                return this.logResponse(response);
            },
            (error) => {
                return this.logError(error);
            }
        );
    }

    /**
     * Logs the details of a request, including the method, URL, headers, and payload.
     *
     * @param {any} config - The configuration object of the request.
     * @return {any} The original configuration object.
     */
    private logRequest(config: any): any {
        return logRequest(config);
    }

    /**
     * Logs the details of a response, including the status code and body.
     *
     * @param {any} response - The response object.
     * @return {any} The original response object.
     */
    private logResponse(response: any): any {
        return logResponse(response, "Soap");
    }

    /**
     * Logs the error details, including response status code and body.
     *
     * @param {any} error - The error object to log.
     * @return {any} The response object associated with the error.
     */
    private logError(error: any): any {
        logError(error, "Soap");
    }
}
