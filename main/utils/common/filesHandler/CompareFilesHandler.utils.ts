/**
 * This class is used to handle the comparison of different files. In case new methods needs to be added
 * this is the place.
 */
import {expect, Page} from "@playwright/test";
import * as fs from "fs";
import * as Path from "path";
import {logger} from "@main/GlobalSetup";
import {getFlatObjectMap} from "@utils/common/TestDataConfig.utils";
import {HandleExcelFile} from "@utils/common/filesHandler/HandleExcelFile.utils";

const staticPath = "testData/static/";
const downloadPath = "testData/downloads/";

export class CompareFilesHandler {
    readonly page: Page;

    constructor(page?: Page) {
        this.page = page;
    }

    /**
     * Methods that compare the size of the downloaded file from the folder testData/downloads with thee exisitng file
     * from the folder testData/static
     *
     * @param staticFilePath
     * @param downloadedFilePath
     */
    async compareFilesSize(staticFileName: string, downloadedFileName: string) {
        let staticFileSize: number;
        let downloadedFileSize: number;
        try {
            staticFileSize = fs.statSync(staticPath + staticFileName).size;
            logger.info(staticFileSize);
        } catch (error) {
            throw new Error("No static file exists");
        }

        try {
            downloadedFileSize = fs.statSync(downloadPath + downloadedFileName).size;
            logger.info(downloadedFileSize);
        } catch (error) {
            throw new Error("No downloaded file exists");
        }

        expect.soft(staticFileSize).toEqual(downloadedFileSize);
    }

    /**
     * Methods that compare the size of the downloaded file from the folder testData/downloads with thee exisitng file
     * from the folder testData/static
     *
     * @param staticFilePath
     * @param downloadedFilePath
     */
    async compareFilesName(staticFileName: string, downloadedFileName: string) {
        let fileName: string;
        let downloadedName: string;
        try {
            fileName = Path.basename(staticPath + staticFileName);
            logger.info(fileName);
        } catch (error) {
            throw new Error("No static file exists");
        }

        try {
            downloadedName = Path.basename(downloadPath + downloadedFileName);
            logger.info(downloadedName);
        } catch (error) {
            throw new Error("No downloaded file exists");
        }

        expect.soft(downloadedName).toEqual(fileName);
    }

    //TODO method: takes the content of the downloaded file and compare it the the existing file
    async compareFilesContent() {
        // TODO
        const staticFile = fs.readFileSync("testData/static/Test test.docx", "utf-8");
        const downloadedFile = fs.readFileSync(`testData/downloads/`, "utf-8");

        logger.info(staticFile === downloadedFile);
        logger.info(expect.soft(staticFile).toEqual(downloadedFile));
    }

    /**
     * Compares the contents of two JSON objects, either by only by paths, or by values as well
     *
     * @param refObj is the reference JSON object
     * @param actualObj is the actual JSON object
     * @param structure if true compares paths, if false compares values as well
     * @returns the list of missing paths or incorrect values.
     */
    async compareJsonByContent(refObj: Object, actualObj: Object, structure: Boolean) {
        let refList: Array<string>;
        let actualList: Array<String>;
        if (structure){
            refList = Array.from(getFlatObjectMap(refObj).keys()).map(v => v.charAt(0).toLowerCase() + v.slice(1));
            actualList = Array.from(getFlatObjectMap(actualObj).keys()).map(v => v.charAt(0).toLowerCase() + v.slice(1));
        } else {
            refList = Array.from(Object.entries(getFlatObjectMap(refObj))
            .map(([k,v]) => `${k}:${v}`)).map(v => v.toLowerCase().replace('.0', ''));
            actualList = Array.from(Object.entries(getFlatObjectMap(actualObj))
            .map(([k,v]) => `${k}:${v}`)).map(v => v.toLowerCase().replace('.0', ''));
        }
        const missing = [];
        for (const key of refList){
            if (!actualList.includes(key)) {
                missing.push(key);
            }
        }
        return missing;
    }
    

    /**
     * Compares the pathings of a JSON object, with a list of pathings from an excel file column
     *
     * @param excelVals contains the reference values from the excel file
     * @param actualObj is the actual JSON object
     * @returns the list of missing paths or incorrect values.
     */
    async compareJsonWithExcelObjects(excelVals: Array<Array<string>>, actualObj: Object) {
        let actualList = Array.from(getFlatObjectMap(actualObj).keys())
        .map(v => v.charAt(0).toLowerCase() + v.slice(1)).map(v => v.replace(/[0-9]/g, '')
        .replace('.ingestionData', 'ingestionData'));
        for (const i in actualList){
            while (actualList[i].includes('..')){
                actualList[i] = actualList[i].replace("..", ".");
            }
        }
        actualList = Array.from(new Set(actualList));
        const missing = [];
        for (const vals of excelVals){
            let found = false;
            for (const key of vals){
                if (actualList.includes(key)) {
                    found = true;
                    break;
                }
            }
            if (!found && !missing.includes(vals.toString())){
                missing.push(vals.toString());
            }       
        }
        return missing;
    }

    /**
     * Compares the contents of two JSON files, either by only by paths, or by values as well
     *
     * @param refPath is the reference JSON file path
     * @param actualPath is the actual JSON file path
     * @param structure if true compares paths, if false compares values as well
     * @returns the list of missing paths or incorrect values.
     */
    async compareJsons(refPath: string, actualPath: string, structure: Boolean) {
        const refObj = JSON.parse(fs.readFileSync(refPath, 'utf-8'));
        const fileObj = JSON.parse(fs.readFileSync(actualPath, 'utf-8'));

        return await this.compareJsonByContent(refObj, fileObj, structure);
    };

    /**
     * Compares the pathings of a JSON file, with an excel file column
     *
     * @param excelPath the excel file path
     * @param jsonPath is JSON file path
     * @param sheetName is the sheet of the excel file, where the pathings are stored
     * @param columnName is the column of the specified sheet of the excel file, where the pathings are stored
     * @returns the list of missing paths or incorrect values.
     */
    async compareJsonWithExcel(excelPath: string, jsonPath: string, sheetName: string, columnName: string) {
        const excelFileHandler = new HandleExcelFile();
        const refObj = await excelFileHandler.getFromColumn(excelPath, sheetName, columnName)
        const fileObj = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

        const compareFileHandler = new CompareFilesHandler();
        return await compareFileHandler.compareJsonWithExcelObjects(refObj, fileObj);
    };

    /**
     * Compares the pathings of multiple JSON files, with an excel file column
     *
     * @param excelPath the excel file path
     * @param jsonFolder is JSON folder path
     * @param sheetName is the sheet of the excel file, where the pathings are stored
     * @param columnName is the column of the specified sheet of the excel file, where the pathings are stored
     * @returns the list of missing paths or incorrect values.
     */
    async compareMultipleJsonWithExcel(excelPath: string, jsonFolder: string, sheetName: string, columnName: string){
        const jsonsInDir = fs.readdirSync(jsonFolder).filter(file => Path.extname(file) === '.json');
        let totalMissing = 0;
        for (const file of jsonsInDir){
            const missing = await this.compareJsonWithExcel(excelPath, jsonFolder + file, sheetName, columnName);
            const output = JSON.stringify(missing);
            fs.writeFile('test-results/' + 'missingReport_' + file, output, (err) => { if (err) console.log(err)});
            totalMissing += missing.length;
        }
        return totalMissing;
    }
}
