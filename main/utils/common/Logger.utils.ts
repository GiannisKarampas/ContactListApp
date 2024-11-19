import { createLogger, format, transports } from "winston";
import * as fs from "fs";

const date = new Date();
const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

export class Logger {
    public static readonly SEPARATOR = "-----------------------------------------------------";

    public static loggerSetup() {
        const myFormat = format.printf(({ level, message, timestamp }) => {
            const log = typeof message === "object" ? JSON.stringify(message, null, 2) : message;
            const boldTimestamp = `\u001b[1m${timestamp}\u001b[22m`;
            const formattedMessage = typeof log === "string"
                ? log.replace(/(https?:\/\/[^\s]+)/g, '\u001b[4m\u001b[34m$1\u001b[24m\u001b[39m')
                : log;

            return `${boldTimestamp} ${level}: ${formattedMessage}`;
        });

        const commonConfig = {
            format: format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            level: process.env.DEBUG === "1" ? "debug" : "info",
        };

        const logger = createLogger({
            ...commonConfig,
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.errors({ stack: true }),
                        myFormat
                    ),
                    level: "debug",
                }),
                new transports.File({
                    filename: `logs/error_${timestamp}.log`,
                    level: "error",
                    format: format.combine(
                        format.errors({ stack: true }),
                        format.json()
                    ),
                }),
                new transports.File({
                    filename: `logs/info_${timestamp}.log`,
                    level: "info",
                    format: format.combine(
                        format.errors({ stack: true }),
                        format.json()
                    ),
                }),
            ],
        });

        return logger;
    }
}
