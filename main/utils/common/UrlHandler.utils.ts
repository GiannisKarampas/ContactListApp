/**
 * This class contains the login setup commands that are using for the authentication setup
 */
import {logger} from "@main/GlobalSetup";
import {RestEndpoints} from "@utils/apiDomains/RestEndpoints";

export const enum Applications {
    SDW = "SDW",
    TECH_RATE = "TECH_RATE",
    STP = "STP",
    DATA_ORCHESTRATION = "DATA_ORCHESTRATION"
}

export class UrlHandler {
    constructor() {}

    /**
     * Method that sets up the url based on the environment and the application.
     *
     * @param {string} environment The environment the config file
     * @param {Applications} app The application for which the url will be created.
     * @returns The final url.
     */
    public static setUrlPerEnvironment(environment: string, app: Applications = Applications.SDW): string {
        if (environment.toUpperCase().includes("EMEA")) {
            return process.env.URL;
        }

        const urlEnvironmentMap: {[key: string]: string} = {
            SDW: RestEndpoints.SDW,
            TECH_RATE: RestEndpoints.TECH_RATE,
            STP : RestEndpoints.STP,
        }
        const appUrl = urlEnvironmentMap[app]

        if (!appUrl) {
            throw new Error ("The application does not exist")
        }
        return appUrl;
    }
}