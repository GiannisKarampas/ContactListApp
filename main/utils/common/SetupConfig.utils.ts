import * as dotenv from "dotenv";

export class SetupConfig {
    public static setPathForConfigFile() {
        const dirname = __dirname.replace("main\\utils\\common", "");
        if (!process.env.CONFIG) {
            process.env.CONFIG = "latam.qa";
        }
        dotenv.config({
            path: dirname + `resources\\config\\.config.${process.env.CONFIG}`,
            override: false,
        });
    }

    public static getConfigFileName() {
        return process.env.CONFIG ? process.env.CONFIG : "No config file selected"
    }
}
