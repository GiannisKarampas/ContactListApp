import {logger} from "@main/GlobalSetup";
import {Rest, restService} from "@main/services/Rest";
import * as process from "node:process";

/**
 * Initializes and returns a new instance of the BrokerApiHandler class.
 *
 * @return {Promise<BrokerApiHandler>} A promise that resolves to a new instance of the KafkaHandler class.
 */
export async function brokerHandler(): Promise<BrokerApiHandler> {
    const brokerHandler = new BrokerApiHandler();
    await brokerHandler.init();
    return brokerHandler;
}

export class BrokerApiHandler {
    private service: Rest;
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = process.env.BROKER_API_URL;
    }

    /**
     * Initializes the KafkaHandler instance by setting up the service and logging in.
     *
     * @return {Promise<BrokerApiHandler>} A promise that resolves to the initialized KafkaHandler instance.
     */
    public async init() {
        this.service = await restService();
        return this;
    }

    /**
     * This method uses Broker API to retrieve the status messages.
     *
     * @param {string} incidentId
     * @return The statuses.
     */
    public async getStatusFromIncidentById(incidentId: string) {
        let url = `${this.baseUrl}/latest/incidents/${incidentId}`;

        const response = await this.service.getRequestWithFullUrl(url, {'osvc-crest-application-context': 1});
        logger.info(response.data.statusWithType);
        return response.data.statusWithType
    }

    /**
     * This method uses the Broker API to retrieve submission status and pending reason.
     *
     * @param {string} incidentId
     * @return The submission status and the pending reason.
     */
    public async getSubmissionStatusAndPendingReasonFromIncidentById(incidentId: string) {
        let url = `${this.baseUrl}/latest/incidents/${incidentId}`;

        const response = await this.service.getRequestWithFullUrl(url, {'osvc-crest-application-context': 1});
        const submissionStatus = await response.data.customFields.c.submission_status.lookupName;
        const pendingReason = await response.data.customFields.c.pending_reason;
        logger.info(`Submission Status: ${submissionStatus}`);
        logger.info(`Pending Reason: ${pendingReason}`);
        return [submissionStatus, pendingReason]
    }
}