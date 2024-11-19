import * as dotenv from "dotenv";
import * as path from "path";

export class SetupConfig {
    public static setPathForConfigFile() {
        const dirname = __dirname.replace(path.join("main", "utils", "common"), "");

        if (!process.env.CONFIG) {
            process.env.CONFIG = "development";
        }

        const configPath = path.join(dirname, "resources", "config", `.config.${process.env.CONFIG}`);
        dotenv.config({
            path: configPath,
            override: false,
        });
    }

    public static getConfigFileName() {
        return process.env.CONFIG ? process.env.CONFIG : "No config file selected"
    }
}
