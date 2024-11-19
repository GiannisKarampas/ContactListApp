import * as dotenv from "dotenv";
import * as path from "path";

export class SetupConfig {
    public static setPathForConfigFile() {
        const dirname = __dirname.replace(path.join("main", "utils", "common"), "");
        if (!process.env.CONFIG) {
            process.env.CONFIG = "development";
        }

        const configPath = dirname + `resources/config/.config.${process.env.CONFIG}`;
        console.log(`Loading config from: ${configPath}`);

        dotenv.config({
            path: configPath,
            override: false,
        });
    }

    public static getConfigFileName() {
        return process.env.CONFIG ? process.env.CONFIG : "No config file selected"
    }
}
