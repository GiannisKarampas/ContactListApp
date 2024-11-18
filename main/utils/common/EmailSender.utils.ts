import * as nodemailer from "nodemailer";
import * as fs from "fs";
import path = require("path");
import MsgReader from "@kenjiuno/msgreader";
import {logger} from "@main/GlobalSetup";
import * as enums from "@enums/Mailboxes.enum";
import {simpleParser} from "mailparser";
import * as process from "node:process";

const dirname = __dirname.replace("main\\utils\\common", "");

export enum EmailFileExtensions {
    EML = ".eml",
    MSG = ".msg"
}

export class EmailSender {
    /**
     * Sends emails to specific recipients and based on specific templates
     *
     * @param {string} emailTemplate - The template that needs to be sent.
     * @param {string | string[]} recipients - The recipients of the email.
     * @param {string} givenSubject - [Optional] The subject that can be given inside a test
     * @param {string} lob - [Optional] The lob folder.
     * @param {string} type - [Optional] File type, default is .msg
     */
    static async sendEmail(emailTemplate: string, recipients: string[], givenSubject?: string,  lob?: string, type?: EmailFileExtensions): Promise<string> {

        if (!process.env.EMAIL || !process.env.PASSWORD) {
            throw new Error("Environment variables for email are not set.");
        }
        const transport = nodemailer.createTransport({
            host: "smtpna.acegroup.com",
            secure: false,
            port: 25,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const templatePath = lob && lob.trim()
            ? (type ? path.join(dirname, `resources/testData/emails/${lob}/${emailTemplate}${type}`) : path.join(dirname, `resources/testData/emails/${lob}/${emailTemplate}.msg`))
            : (type ? path.join(dirname, `resources/testData/emails/${emailTemplate}${type}`) : path.join(dirname, `resources/testData/emails/${emailTemplate}.msg`));
            
            if (!fs.existsSync(templatePath)) {
                logger.error(`The path ${templatePath} does not exist.`);
                throw new Error(`The path ${templatePath} does not exist.`);
            }
       
            type = type ? type : EmailFileExtensions.MSG

        try {
            if (type === EmailFileExtensions.MSG) {
                const fileContent = fs.readFileSync(templatePath);
                const msgReader = new MsgReader(fileContent);
                const subject = await this.setSubjectForEmails(type, givenSubject, msgReader)

                await this.sendMsgEmail(transport, msgReader, recipients, subject, emailTemplate)
                return subject;
            } else if (type === EmailFileExtensions.EML) {
                const emlContent = fs.readFileSync(templatePath, "utf-8");
                const {headers} = await simpleParser(emlContent);
                const map = new Map(headers);
                const subject = await this.setSubjectForEmails(type, givenSubject, map)

                await this.sendEmlEmail(transport, emlContent, recipients, subject, emailTemplate)
                return subject;
            }
            throw new Error("Unsupported file extension.");
        } catch (error) {
            logger.error(error);
        }
    }

    /**
     * Sends emails to specific recipients and based on specific templates
     *
     * @param {nodemailer.Transporter} transport - Contains the information needed for the SMT connection.
     * @param {Object} mailOptions - The information for the email delivery.
     * @param {string} emailTemplate - The template that needs to be sent.
     * @param {string[]} recipients - The recipients of the email.
     * @param {string} subject - The suffix that will be added to the actual email subject.
     */
   private static async mailPromise(transport: nodemailer.Transporter, mailOptions: Object, subject: string, recipients: string[], emailTemplate?: string){
        await new Promise((resolve, reject) => {
            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(error);
                    reject(error);
                } else {
                    if (emailTemplate){
                        logger.info(`The ${emailTemplate} with subject ${subject}, sent to the ${recipients}`);
                    } else {
                        logger.info(`The email with subject ${subject}, sent to the ${recipients}`);
                    }
                    resolve(info);
                }
            });
        });
    };

    /**
     * Creates and sends .msg emails to specific recipients and based on specific templates.
     *
     * @param {nodemailer.Transporter} transport - The needed configurations.
     * @param {MsgReader} msgReader - The library needed to get the parsed data from the email.
     * @param {string | string[]} recipients - The recipients of the email.
     * @param {string} subject - The subject that can be given inside a test.
     * @param {string} emailTemplate - The template needs to be sent.
     */
    private static async sendMsgEmail(transport: nodemailer.Transporter, msgReader: MsgReader, recipients: string[], subject: string, emailTemplate: string): Promise<void> {
        const msgData = msgReader.getFileData();
        const email = msgData.body;
        const html = String.fromCharCode.apply(null, msgData.html);
        const attachments = [];

        msgData.attachments.forEach((attachment, index) => {
            if (!attachment?.attachmentHidden) {
                attachments.push({
                    filename: attachment.fileName,
                    content: Buffer.from(msgReader.getAttachment(index).content),
                });
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: recipients,
            subject: subject,
            text: email,
            html,
            attachments,
        };

        await this.mailPromise(transport, mailOptions, subject, recipients, emailTemplate);
    }

    /**
     * Creates and sends .eml emails to specific recipients and based on specific templates.
     *
     * @param {nodemailer.Transporter} transport - The needed configurations.
     * @param {string} emlContent - The library needed to get the parsed data from the email.
     * @param {string | string[]} recipients - The recipients of the email.
     * @param {string} subject - The subject that can be given inside a test.
     * @param {string} emailTemplate - The template needs to be sent.
     */
    private static async sendEmlEmail(transport: nodemailer.Transporter, emlContent: string, recipients: string[], subject: string, emailTemplate: string): Promise<void> {
        const {headers, text, html, attachments} = await simpleParser(emlContent);

        const mailOptions = {
            from: process.env.EMAIL,
            to: recipients,
            subject: subject,
            text: text,
            html: html,
            attachments: attachments,
            headers: {
                InReplyTo: headers.messageId,
                References: headers.references ? headers.references + " " + headers.messageId : headers.messageId,
            },
        };

        await this.mailPromise(transport, mailOptions, subject, recipients, emailTemplate);
    }

    /**
     * Creates the subject will be sent.
     *
     * @param {string} type - File type, default is .msg
     * @param {string} givenSubject - [Optional] The subject that can be given inside a test
     * @param {MsgReader | string} data - The library needed to get the original subject from the email.
     * @returns emailSubject
     */
    private static async setSubjectForEmails(type: EmailFileExtensions, givenSubject: string | undefined, data: MsgReader | Map<unknown, unknown>): Promise<string> {
        const date = Date.now();
        const env = process.env.CONFIG;
        let emailSubject: string = "";
        let dataSubject: string = "";
        if (type === EmailFileExtensions.MSG) {
            dataSubject = (data as MsgReader).getFileData().subject.includes("FW") ? (data as MsgReader).getFileData().subject.replace(/FW:/gi, "").trim() : (data as MsgReader).getFileData().subject;
        } else {
            dataSubject = (data as Map<unknown, unknown>).get("subject").toString().includes("FW:") ? (data as Map<unknown, unknown>).get("subject").toString().replace(/FW:/gi, "").trim() : (data as Map<unknown, unknown>).get("subject").toString();
        }

        let noRushSubject = type === EmailFileExtensions.MSG ? dataSubject.replace(/RUSH/gi, "").trim() :  dataSubject.replace(/RUSH/gi, "").trim();
        const subject = givenSubject ? givenSubject : "";

        emailSubject = env.includes("uat") ? `${noRushSubject}_${subject}: Test date ${date}` : `RUSH ${noRushSubject}_${subject}: Test date ${date}`;
        return emailSubject;
    }
}

/**
 * Returns the email address of a specific mailbox
 *
 * @param {string} mailbox - The mailbox, fow which the email address is requested.
 * @return {string} The email address of the requested mailbox.
 */
export function emailAddress(mailbox: string): string {
    enums;
    const env = process.env.ENV ? process.env.ENV.toUpperCase() : "";
    const enumMailboxEnv = `Mailbox${env}`;
    if (enums[enumMailboxEnv] && enums[enumMailboxEnv][mailbox]) {
        return enums[enumMailboxEnv][mailbox];
    } else {
        throw new Error(`Mailbox ${mailbox} not found for environment ${env}`);
    }
}

/**
 * Returns all the files with file a specific type from a specific folder path
 *
 * @param {string} folderPath - The folder path to search in.
 * @param {string} fileExtension - The file's extension. Can be .msg or .eml
 * @return {string} The msg file names of the requested path.
 */
export function getEmailFileNames(folderPath: string, fileExtension: string): string[] {
    const files = fs.readdirSync(folderPath);
    return files.filter((file) => path.extname(file).toLowerCase() === fileExtension).map((file) => path.parse(file).name);
}


