const xlsx = require("xlsx-populate");
import * as XLSX from "xlsx";
import { logger } from "@main/GlobalSetup";

export class HandleExcelFile {
    constructor() {}

    /**
     * Function that reads the Excel file, iterate each rows and each cell
     * and check the selected values
     */
    async readAndCheckValues() {
        const workbook = XLSX.readFile("testData/downloads/test.xlsx");
        const sheetName = workbook.SheetNames[0];

        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {defval: "", raw: false});

        data.forEach((row, rowIndex) => {
            Object.keys(row).forEach((key, cellIndex) => {
                if (key === "LoadAction" && row[key] === "No Change") {
                    logger.info(`Row number: ${rowIndex + 1}, Cell number: ${cellIndex + 1}, Cell value: ${row[key]}`);
                }
            });
        });
    }

    /**
     * Function that reads the Excel file and updates the cells based on the column name
     */
    async updateFileCells() {
        const inputFile = "testData/downloads/***.xlsx";
        const outputFile = "testData/uploads/updateTestFile.xlsx";

        // Define the values for each header
        const valuesByHeader: {[key: string]: string[]} = {
            Country: ["Greece"],
            GroupReportingVendorName: ["CORPORATE/MID-MARKET"],
            // Add more headers and their corresponding values as needed
        };

        try {
            // Load the original Excel file
            await xlsx.fromFileAsync(inputFile).then((workbook) => {
                const sheet = workbook.sheet(0);
                const usedRange = workbook.sheet(0).usedRange().value().length;

                // Find the header row
                let headers: {[key: string]: number} = {};
                const headerRow = sheet.row(1);
                for (let i = 1; i <= headerRow._cells.length; i++) {
                    if (headerRow._cells[i] === undefined || headerRow._cells[i]._value === undefined) {
                        break;
                    }
                    let headerValue = headerRow._cells[i]._value;
                    headers[headerValue] = i;
                }

                /**
                 * Update cells based on headers
                 * The rowNumber depends on the row we want to start the modification
                 * e.g. if we want to start from the 2nd row we have as rowNumber = 2 and rowNumber - 2
                 * Keep in mind that the 1st row is the Headers
                 *
                 */
                for (let rowNumber = 2; rowNumber <= usedRange; rowNumber++) {
                    const row = sheet.row(rowNumber);
                    for (const header in headers) {
                        if (headers.hasOwnProperty(header)) {
                            const colNumber = headers[header];
                            const values = valuesByHeader[header];
                            if (values && rowNumber - 2 < values.length) {
                                row.cell(colNumber).value(values[rowNumber - 2]);
                            }
                        }
                    }
                }

                // Save the modified workbook
                logger.info("Updated file created successfully.");
                return workbook.toFileAsync(outputFile);
            });
        } catch (error) {
            logger.error(error);
        }
    }

    /**
     * Function that reads the Excel file and returns the data from a specific sheet and column
     */
    async getFromColumn(path: string, sheet: string, column: string){
        const workbook = XLSX.readFile(path);
        const worksheet = workbook.Sheets[sheet];
        const data: Array<Array<string>> = [];
        const columnName = Object.keys(worksheet).find(key=> worksheet[key].v === column);

        for (const key in worksheet) {
            const strKey = key.toString();
            try {
                if (strKey.slice(0,strKey.search(strKey.match(/\d+/)[0])) === 
                columnName.slice(0,columnName.search(columnName.match(/\d+/)[0]))) {
                    const cleanEntries = await this.cleanExcelEntry(worksheet[key].v);
                    cleanEntries.filter((item,index) => cleanEntries.indexOf(item) === index).slice(1);
                    if (!data.includes(cleanEntries) && cleanEntries.length !== 0){
                        data.push(cleanEntries);
                    }      
                }
            } catch{}        
        }
        return data;
    }

    /**
     * Function that fixes the excel entries
     */
    async cleanExcelEntry(origEntry: string){
        const cleanEntries: Array<string> = []
        const entries = await this.splitExcelEntry(origEntry);

        for (const entry of entries){
            let fixedEntry: string
            if (entry.includes("IngestionData")){
                fixedEntry = entry.replace("IngestionData", "ingestionData");
            } else {
                fixedEntry = entry;
            };
            if (fixedEntry.includes("ingestionData")){
                fixedEntry = fixedEntry.substring(fixedEntry.indexOf("ingestionData"));
                if (fixedEntry.includes("where")){
                    fixedEntry = fixedEntry.substring(0, fixedEntry.indexOf("where")-1);
                }
                if (fixedEntry.includes(" or")){
                    fixedEntry = fixedEntry.substring(0, fixedEntry.indexOf("or")-1);
                }
                while ((fixedEntry.includes('[]')) || (fixedEntry.includes('[0]')) || (fixedEntry.includes('/\n/'))){
                    fixedEntry = fixedEntry.replace('/\n/', '')
                    .replace('[0]', '').replace('[]', '');
                }
                if (!fixedEntry.includes("n/a") && !fixedEntry.includes("should")
                && !fixedEntry.includes("Duplicate")){
                    cleanEntries.push(fixedEntry);
                } 
            };
        } 
        return cleanEntries
    }

    /**
     * Function that splits the excel entries that have muktiple pathings
     */
    async splitExcelEntry(entry: string){
        return entry.includes('\ningestion') ? entry.split('\n') : [entry];
    }
}
