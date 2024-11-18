import {selectRelativeCountryCode} from "@enums/Countries.enum";
import {Environment} from "@enums/Environment.enum";
import {ContextData} from "@main/models/ContextData";
import {RestEndpoints} from "@utils/apiDomains/RestEndpoints";
import {Route} from "@utils/apiDomains/Route";
import {Authentication} from "@utils/common/Authentication.utils";
import axios, {AxiosHeaderValue, AxiosInstance, AxiosResponse, Method} from "axios";
import * as https from "https";
import * as process from "node:process";
import {logger} from "@main/GlobalSetup";
import {logError, logRequest, logResponse} from "@main/services/WebService";

/**
 * Initializes the Rest service by creating a new instance of the Rest class,
 * initializing it, and returning it.
 *
 * @return {Promise<Rest>} A promise that resolves to the initialized Rest instance.
 */
export async function restService(countryCode: string = selectRelativeCountryCode()): Promise<Rest> {
    const rest = new Rest();
    await rest.init(countryCode);
    return rest;
}

export class Rest {
    public static readonly REST_CONTENT_TYPE: string = "application/json";
    private contextData: ContextData;
    private requestSpec: AxiosInstance;
    private authentication: Authentication;
    private basicAuth: {};

    /**
     * Initializes the Rest class by creating a new ContextData instance,
     * retrieving the request specification using the getRequestSpec method,
     * and setting up the Axios interceptors.
     *
     * @return {Promise<void>} A promise that resolves when the initialization is complete.
     */
    public async init(countryCode: string = selectRelativeCountryCode()): Promise<Rest> {
        this.authentication = new Authentication();
        this.basicAuth = {username: process.env.BROKER_USERNAME, password: process.env.BROKER_PASSWORD}
        // this.basicAuth = (await this.authentication.getRestAuthToken()).accessToken;
        this.contextData = new ContextData();
        this.requestSpec = await this.getRequestSpec(countryCode);
        this.setupAxiosInterceptors();
        return this;
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
     * @param {string | typeof RestEndpoints} basePath - The base path for the request.
     * @param {string | typeof Route} route - The route for the request.
     * @param {any} body - The body of the request.
     * @param {{[key: string]: any} | null} [pathParams] - Optional path parameters for the request.
     * @param {{[key: string]: any} | null} [queryParams] - Optional query parameters for the request.
     * @param {File | null} [file] - Optional file for the request.
     * @param contentType
     * @param requestSpec
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse of the request.
     */
    public async postRequest(basePath: string | typeof RestEndpoints,
                             route: string | typeof Route,
                             body: any,
                             pathParams?: {[key: string]: any} | null,
                             queryParams?: {[key: string]: any} | null,
                             file?: File | null,
                             contentType?: string,
                             requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequest("POST", basePath, route, body, pathParams, queryParams, file, contentType, requestSpec);
    }

    public async postRequestWithFullUrl(fullUrl: string,
                                        headers?: {[key: string]: AxiosHeaderValue} | null,
                                        body?: any,
                                        pathParams?: {[key: string]: any} | null,
                                        queryParams?: {[key: string]: any} | null,
                                        file?: File | null,
                                        contentType?: string,
                                        requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequestWithFullUrl("POST", fullUrl, headers, body, pathParams, queryParams, file, contentType, requestSpec);
    }

    /**
     * Sends a GET request to the specified basePath and route with the given pathParams, queryParams, and contentType.
     *
     * @param {string | typeof RestEndpoints} basePath - The base path for the request.
     * @param {string | typeof Route} route - The route for the request.
     * @param body
     * @param {{[key: string]: any} | null} [pathParams] - Optional path parameters for the request.
     * @param {{[key: string]: any} | null} [queryParams] - Optional query parameters for the request.
     * @param {string} [contentType] - Optional content type for the request.
     * @param requestSpec
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse of the request.
     */
    public async getRequest(basePath: string | typeof RestEndpoints,
                            route: string | typeof Route,
                            pathParams?: {[key: string]: any} | null,
                            queryParams?: {[key: string]: any} | null,
                            body?: any,
                            contentType?: string,
                            requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequest("GET", basePath, route, body, pathParams, queryParams, null, contentType, requestSpec);
    }

    public async getRequestWithFullUrl(fullUrl: string,
                                       headers?: {[key: string]: AxiosHeaderValue} | null,
                                       pathParams?: {[key: string]: any} | null,
                                       queryParams?: {[key: string]: any} | null,
                                       body?: any,
                                       contentType?: string,
                                       requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequestWithFullUrl("GET", fullUrl, headers, body, pathParams, queryParams, null, contentType, requestSpec);
    }

    /**
     * Sends a PUT request to the specified basePath and route with the given body, pathParams, queryParams.
     *
     * @param {string | typeof RestEndpoints} basePath - The base path for the request.
     * @param {string | typeof Route} route - The route for the request.
     * @param {any} [body] - The body of the request.
     * @param {{[key: string]: any} | null} [pathParams] - Optional path parameters for the request.
     * @param {{[key: string]: any} | null} [queryParams] - Optional query parameters for the request.
     * @param contentType
     * @param requestSpec
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse of the request.
     */
    public async putRequest(basePath: string | typeof RestEndpoints,
                            route: string | typeof Route,
                            body?: any,
                            pathParams?: {[key: string]: any} | null,
                            queryParams?: {[key: string]: any} | null,
                            contentType?: string,
                            requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequest("PUT", basePath, route, body, pathParams, queryParams, null, contentType, requestSpec);
    }

    public async putRequestWithFullUrl(fullUrl: string,
                                       headers?: {[key: string]: AxiosHeaderValue} | null,
                                       body?: any,
                                       pathParams?: {[key: string]: any} | null,
                                       queryParams?: {[key: string]: any} | null,
                                       contentType?: string,
                                       requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequestWithFullUrl("PUT", fullUrl, headers, body, pathParams, queryParams, null, contentType, requestSpec);
    }

    /**
     * Sends a PATCH request to the specified basePath and route with the given body, pathParams, and queryParams.
     *
     * @param {string | typeof RestEndpoints} basePath - The base path for the request.
     * @param {string | typeof Route} route - The route for the request.
     * @param {any} [body] - The body of the request.
     * @param {{[key: string]: any} | null} [pathParams] - Optional path parameters for the request.
     * @param {{[key: string]: any} | null} [queryParams] - Optional query parameters for the request.
     * @param contentType
     * @param requestSpec
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse of the request.
     */
    public async patchRequest(basePath: string | typeof RestEndpoints,
                              route: string | typeof Route,
                              body?: any,
                              pathParams?: {[key: string]: any} | null,
                              queryParams?: {[key: string]: any} | null,
                              contentType?: string,
                              requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequest("PATCH", basePath, route, body, pathParams, queryParams, null, contentType, requestSpec);
    }

    public async patchRequestWithFullUrl(fullUrl: string,
                                         headers?: {[key: string]: AxiosHeaderValue} | null,
                                         body?: any,
                                         pathParams?: {[key: string]: any} | null,
                                         queryParams?: {[key: string]: any} | null,
                                         contentType?: string,
                                         requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequestWithFullUrl("PATCH", fullUrl, headers, body, pathParams, queryParams, null, contentType, requestSpec);
    }

    /**
     * Sends a DELETE request to the specified basePath and route with the given pathParams and queryParams.
     *
     * @param {string | typeof RestEndpoints} basePath - The base path for the request.
     * @param {string | typeof Route} route - The route for the request.
     * @param {{[key: string]: any} | null} [pathParams] - Optional path parameters for the request.
     * @param {{[key: string]: any} | null} [queryParams] - Optional query parameters for the request.
     * @param contentType
     * @param requestSpec
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse of the request.
     */
    public async deleteRequest(basePath: string | typeof RestEndpoints,
                               route: string | typeof Route,
                               body?: any,
                               pathParams?: {[key: string]: any} | null,
                               queryParams?: {[key: string]: any} | null,
                               contentType?: string,
                               requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequest("DELETE", basePath, route, body, pathParams, queryParams, null, contentType, requestSpec);
    }

    public async deleteRequestWithFullUrl(fullUrl: string,
                                          headers?: {[key: string]: AxiosHeaderValue} | null,
                                          body?: any,
                                          pathParams?: {[key: string]: any} | null,
                                          queryParams?: {[key: string]: any} | null,
                                          contentType?: string,
                                          requestSpec = this.requestSpec): Promise<AxiosResponse> {
        return this.sendRequestWithFullUrl("DELETE", fullUrl, headers, body, pathParams, queryParams, null, contentType, requestSpec);
    }

    /**
     * Creates a request specification for making HTTP requests to the REST API.
     *
     * @param countryCode
     * @param {string} [contentType=Rest.REST_CONTENT_TYPE] - The content type of the request. Defaults to the REST content type.
     * @param basicAuth
     * @param baseURL
     * @return {Promise<AxiosInstance>} A promise that resolves to an Axios instance with the request specification.
     */
    public async getRequestSpec(countryCode: string = selectRelativeCountryCode(),
                                contentType: string = Rest.REST_CONTENT_TYPE,
                                basicAuth: {} = this.basicAuth,
                                baseURL: string = process.env.REST_BASE_URL): Promise<AxiosInstance> {

        const requestSpecBuilder = axios.create({
            baseURL: baseURL,
            auth: {
                username:process.env.BROKER_USERNAME,
                password:process.env.BROKER_PASSWORD
            },
            headers: {
                "Content-Type": contentType,
            },
            insecureHTTPParser: true,
            httpsAgent: new https.Agent({rejectUnauthorized: false}),
        });

        return requestSpecBuilder;
    }

    /**
     * Constructs and sends a request with the specified parameters.
     *
     * @param {Method} method - The HTTP method for the request.
     * @param {string | typeof RestEndpoints} basePath - The base path for the request.
     * @param {string | typeof Route} route - The route for the request.
     * @param {any} body - The body of the request.
     * @param {{[key: string]: any} | null} pathParams - Optional path parameters for the request.
     * @param {{[key: string]: any} | null} queryParams - Optional query parameters for the request.
     * @param {File | null} file - The file to be sent with the request, if any.
     * @param {string} [contentType=Rest.REST_CONTENT_TYPE] - The content type of the request.
     * @param {AxiosInstance} [requestSpec=this.requestSpec] - The Axios instance to use for the request.
     * @return {Promise<AxiosResponse>} The response from the request.
     */
    private async sendRequest(method: Method,
                              basePath: string | typeof RestEndpoints,
                              route: string | typeof Route,
                              body: any,
                              pathParams: {[key: string]: any} | null,
                              queryParams: {[key: string]: any} | null,
                              file: File | null,
                              contentType: string = Rest.REST_CONTENT_TYPE,
                              requestSpec: AxiosInstance = this.requestSpec): Promise<AxiosResponse> {
        const request = requestSpec;

        const startTime = performance.now();

        // Construct the URL with base path and route
        if (process.env.ENV === Environment.QA || process.env.REST_AUTH_URL !== process.env.REST_BASE_URL) {
            basePath = process.env.API_PATH;
        }

        let url = request.defaults.baseURL + basePath + route;

        // Replace any path parameters in the URL
        if (pathParams) {
            for (const [key, value] of Object.entries(pathParams)) {
                url = url.replace(`{${key}}` || `:${key}`, value.toString());
            }
        }

        return this.buildRequest(method, url, queryParams, body, file, contentType, request, startTime);
    }

    /**
     * Sends a request with the specified parameters.
     *
     * @param {Method} method - The HTTP method for the request.
     * @param {string} fullUrl - The full URL for the request.
     * @param {{[key: string]: AxiosHeaderValue}} headers - The headers for the request.
     * @param {any} body - The body of the request.
     * @param {{[key: string]: any} | null} pathParams - Optional path parameters for the request.
     * @param {{[key: string]: any} | null} queryParams - Optional query parameters for the request.
     * @param {File | null} file - Optional file to upload.
     * @param {string} contentType - Optional content type for the request.
     * @param {AxiosInstance} requestSpec - Optional request specification.
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response.
     */
    private async sendRequestWithFullUrl(method: Method,
                                         fullUrl: string,
                                         headers: {[key: string]: AxiosHeaderValue},
                                         body: any,
                                         pathParams: {[key: string]: any} | null,
                                         queryParams: {[key: string]: any} | null,
                                         file: File | null,
                                         contentType: string = Rest.REST_CONTENT_TYPE,
                                         requestSpec: AxiosInstance = this.requestSpec): Promise<AxiosResponse> {
        const request = requestSpec;
        this.setupAxiosInterceptors(request)

        if (headers === null || headers === undefined) {
            headers = {};
        }

        request.defaults.headers.common = headers;
        request.defaults.baseURL = fullUrl;

        return this.buildRequest(method, fullUrl, queryParams, body, file, contentType, request, performance.now());
    }

    /**
     * Set up the request configuration, handle file uploads if present, make the request, log the response duration,
     * and set context data based on the response.
     *
     * @param {Method} method - The HTTP method for the request.
     * @param {string} url - The URL for the request.
     * @param {{[key: string]: any} | null} queryParams - Optional query parameters for the request.
     * @param {any} body - The body of the request.
     * @param {File | null} file - Optional file to be uploaded.
     * @param {string} contentType - The content type of the request.
     * @param {AxiosInstance} request - The Axios instance to make the request.
     * @param {number} startTime - The start time of the request.
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse of the request.
     */
    private async buildRequest(method: Method,
                               url: string,
                               queryParams: {[key: string]: any} | null,
                               body: any,
                               file: File | null,
                               contentType: string,
                               request: AxiosInstance,
                               startTime: number): Promise<AxiosResponse> {
        // Set up the request config
        const config = {
            method,
            url,
            params: queryParams,
            data: body,
            headers: {
                "Content-Type": file ? "multipart/form-data" : contentType,
            },
            startTime: startTime,
        };

        // Handle file upload
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("payload", body);
            config.data = formData;
        }

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
    public setupAxiosInterceptors(requestSpec: AxiosInstance = this.requestSpec) {
        if (process.env.DEBUG === "1") {
            logger.info("Setup Axios Interceptors");

            requestSpec.interceptors.request.use((config) => {
                return this.logRequest(config);
            });

            requestSpec.interceptors.response.use(
                (response) => {
                    return this.logResponse(response);
                },
                (error) => {
                    return this.logError(error);
                },
            );
        }
    }

    /**
     * Masks the "Authorization" header in the given headers object.
     *
     * @param {object} headers - The headers object.
     * @return {object} The updated headers object with the "Authorization" header masked.
     */
    private maskHeaders(headers: any): object {
        if (headers["Authorization"]) {
            headers["Authorization"] = "[MASKED]";
        }
        return headers;
    }

    /**
     * Logs the details of a request, including the method, URL, headers, and payload.
     *
     * @param {any} config - The configuration object of the request.
     * @return {any} The original configuration object.
     */
    private logRequest(config: any): any {
        const headers = {...config.headers};
        const maskedHeaders = this.maskHeaders(headers);
        return logRequest(config, maskedHeaders);
    }

    /**
     * Logs the details of a response, including the status code and body.
     *
     * @param {any} response - The response object.
     * @return {any} The original response object.
     */
    private logResponse(response: any): any {
        return logResponse(response, "Rest");
    }

    /**
     * Logs the error details, including response status code and body.
     *
     * @param {any} error - The error object to log.
     * @return {any} The response object associated with the error.
     */
    private logError(error: any): any {
        return logError(error, "Rest");
    }
}