/**
 * This class is used to handle the downloding of files. All files are downloaded in the testData/downloads
 * folder. In case new methods needs to be added this is the place.
 */
import {formatJson} from "@main/utils/Common.utils";
import {Locator, Page} from "@playwright/test";
import {AxiosResponse} from "axios";
import * as fs from "fs";
import * as path from "path";

export class DownloadFilesHandler {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Method that download a file and store it in the folder testData/downloads
     *
     * @param locator
     * @param fileName // Optional
     */
    async downloadFile(locator: Locator, fileName?: string) {
        const filePath: string = "resources/testData/downloads/";

        const downloadPromise = this.page.waitForEvent("download");
        await locator.click();
        const download = await downloadPromise;

        if (!fileName) {
            fileName = download.suggestedFilename();
        }

        await download.saveAs(filePath + fileName);
    }

    /**
     * Method that download a file, using the corresponding API and store it in the folder resources/testData/downloads/
     *
     * @param {AxiosResponse} response - The Axios response object.
     */
    static async downloadFilesApi(response: AxiosResponse<any, any>) {
        const dirname = __dirname.replace("main\\utils\\common\\filesHandler", "");
        const filename = response.headers["content-disposition"].match(/filename="(.+)"/)[1];
        const filePath = path.join(dirname, `resources/testData/downloads/${filename}`);
        fs.writeFileSync(filePath, formatJson(response.data));
    }
}
