import {Page} from "@playwright/test";

export class Common {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

/**
 * Returns the current date in the MM/DD/YYYY format.
 * @returns {string} The current date in the MM/DD/YYYY format.
 */
export const getCurrentDate = (): string => {
    const today: Date = new Date();
    const month: string = String(today.getMonth() + 1).padStart(2, "0");
    const day: string = String(today.getDate()).padStart(2, "0");
    const year: number = today.getFullYear();

    return `${month}/${day}/${year}`;
};

/**
 * Returns the current date in the MM/DD/YYYY format.
 * @returns {string} The current date in the MM/DD/YYYY HH:mm format.
 */
export const getCurrentDateTime = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = String(today.getFullYear());
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

/**
 * Returns the provided (in milliseconds) time in regular format (hh:mm:ss)
 * @param milliseconds the provided time to convert
 * @returns
 */
export const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

    return [hours.toString().padStart(2, "0"), minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
};

/**
 * A function that formats XML content with specified indentation.
 *
 * @param {any} xml - The XML content to be formatted
 * @param {string} tab - Optional. The indent value. Defaults to tab (\t)
 * @return {string} The formatted XML content
 */
export function formatXml(xml: any, tab?: string): string {
    var formatted = "",
        indent = "";
    tab = tab || "\t";
    xml.split(/>\s*</).forEach(function (node) {
        if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
        formatted += indent + "<" + node + ">\r\n";
        if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab;
    });
    return formatted.substring(1, formatted.length - 3);
}

/**
 * Formats a JSON object into a string with indentation.
 *
 * @param {any} json - The JSON object to be formatted.
 * @return {string} The formatted JSON string.
 */
export function formatJson(json: any): string {
    return JSON.stringify(json, null, "\t");
}

/**
 * Create a unix based timestamp.
 */
export function createUnixTime() {
    const currentDate = new Date();

    // Set the desired time
    currentDate.setHours(12);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    // Get the Unix timestamp
    const unixTime = Math.floor(currentDate.getTime() / 1000);
    return unixTime;
}
