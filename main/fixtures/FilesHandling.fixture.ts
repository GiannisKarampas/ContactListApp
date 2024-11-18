/**
 * In this file, are imported all the classes that are related on files handling functionalities.
 */

import {test as base} from "@playwright/test";
import {CompareFilesHandler} from "@utils/common/filesHandler/CompareFilesHandler.utils";
import {UploadFilesHandler} from "@utils/common/filesHandler/UploadFilesHandler.utils";
import {DownloadFilesHandler} from "@utils/common/filesHandler/DownloadFilesHandler.utils";
import {HandleExcelFile} from "@utils/common/filesHandler/HandleExcelFile.utils";

type FilesHandlingFixtures = {
    compareFilesHandler: CompareFilesHandler;
    uploadFilesHandler: UploadFilesHandler;
    downloadFilesHandler: DownloadFilesHandler;
    excelFilesHandler: HandleExcelFile;
};

export const test = base.extend<FilesHandlingFixtures>({
    compareFilesHandler: async ({page}, use) => {
        const compareFilesHandler = new CompareFilesHandler(page);
        await use(compareFilesHandler);
    },

    uploadFilesHandler: async ({page}, use) => {
        const uploadFilesHandler = new UploadFilesHandler(page);
        await use(uploadFilesHandler);
    },

    downloadFilesHandler: async ({page}, use) => {
        const downloadFilesHandler = new DownloadFilesHandler(page);
        await use(downloadFilesHandler);
    },

    excelFilesHandler: async ({}, use) => {
        const excelFilesHandler = new HandleExcelFile();
        await use(excelFilesHandler);
    },
});

export {expect} from "@playwright/test";
