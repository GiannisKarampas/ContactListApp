import {createLogger, transports, format, Logform} from "winston";

const date = new Date();
const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

export class Logger {
    public static loggerSetup() {
        const myFormat = format.printf(({level, message, timestamp}) => {
            return `${timestamp} ${level}: ${typeof message == "object" ? JSON.stringify(message, null, 2) : message}`;
        });

        const logger = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                format.errors({stack: true}),
                format.splat(),
                format.json(),
                myFormat
            ),
            transports: [
                new transports.Console({silent: false}),
                new transports.File({
                    filename: `logs/error_${timestamp}.log`,
                    level: 'error'
                }),
                new transports.File({
                    filename: `logs/info_${timestamp}.log`,
                    level: 'info'
                })
            ]
        })

        return logger;
    }
}