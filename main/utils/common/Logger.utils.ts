import {createLogger, format, transports} from "winston";

const date = new Date();
const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export class Logger {
    public static readonly SEPARATOR = "-----------------------------------------------------";

    public static loggerSetup() {
        let logger;
        const myFormat = format.printf(({level, message, timestamp}) => {
            const log = typeof message === "object" ? JSON.stringify(message, null, 2) : message;
            const boldTimestamp = `\u001b[1m${timestamp}\u001b[22m`;
            const formattedMessage = log.replace(/(https?:\/\/[^\s]+)/g, '\u001b[4m\u001b[34m$1\u001b[24m\u001b[39m');

            return `${boldTimestamp} ${level}: ${formattedMessage}`;
        });
        const commonConfig = {
            format: format.combine(
                format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss"
                }),
                format.errors({stack: true}),
                format.splat(),
                format.json(),
                myFormat
            )
        };

        if (process.env.DEBUG === "1") {
            logger = createLogger({
                ...commonConfig,
                level: "debug",
                transports: [
                    new transports.Console({
                        level: "debug",
                        handleExceptions: true,
                        silent: false
                    }),
                    new transports.File({
                        filename: `logs/error_${timestamp}.log`,
                        level: "error"
                    }),
                    new transports.File({
                        filename: `logs/info_${timestamp}.log`,
                        level: "info"
                    })
                ]
            });
            return logger;
        }

        logger = createLogger({
            ...commonConfig,
            level: "info",
            transports: [new transports.Console({silent: false})]
        });

        return logger;
    }
}
