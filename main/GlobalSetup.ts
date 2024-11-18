import * as dotenv from "dotenv";
import {AuthSetupConfig} from "@utils/common/AuthSetupConfig.utils";
import {Logger} from "@utils/common/Logger.utils";
import {SetupConfig} from "@utils/common/SetupConfig.utils";

dotenv.config();

let authSetup: AuthSetupConfig;
let users: string[] = [];

authSetup = new AuthSetupConfig();
export const logger = Logger.loggerSetup();

/**
 * Global setup method which is executed before everything
 */
async function setup() {
    SetupConfig.setPathForConfigFile();

    if (process.env.SETUP === "1") {
        await setupUsers();
    }

    logger.info("Config file to use: " + SetupConfig.getConfigFileName());
    logger.info("Global setup finished");
}

/**
 * Function that sets up the Database
 */
async function setupDatabase() {
    logger.info("DB setup started");
    logger.info("DB setup finished");
}

/**
 * Function that prepares and creates the storageState for the application users
 */
async function setupUsers() {
    users = await authSetup.createRolesAndUsers();
    logger.info(`Setup Users: ${users}`);

    for (let i = 0; i < users.length; i++) {
        if (await authSetup.shouldSetupStorageState(users[i])) {
            await authSetup.setupAuthStorageStateFileForUser(users[i]);
        }
    }
}

export default setup;
