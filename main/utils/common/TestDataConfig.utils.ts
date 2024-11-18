import * as fs from "fs";
import {logger} from "@main/GlobalSetup";
import * as path from "path";
import {getCurrentDate, getCurrentDateTime} from "@utils/Common.utils";

export const testData = {
    testInfo: undefined
};

/**
 * Loads the test data located in the JSON specified in the filepath.
 */
export class TestDataLoader {
    constructor(private filePath: string) {
    }

    loadTestData(): any {
        let testData: any;
        try {
            testData = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
        } catch (error) {
            //Correction in case the data file is not region specific but the region is incorrectly included in the filePath
            logger.info("Unable to find data file '" + this.filePath.substring(this.filePath.lastIndexOf("\\") + 1) + "' in '" + process.env.REGION + "' - attempting to search in general folder instead.");
            testData = JSON.parse(fs.readFileSync(this.filePath.replace(process.env.REGION, ""), "utf8"));
        }
        return testData;
    }
}

/**
 * Returns the Jira Id of the test case that is currently executed, provided that it has been set as a tag in advance.
 * @returns the Jira ticket Id if it exists or null if there is no tag.
 */
export function getTestCaseJiraId() {
    const jiraTag = testData.testInfo.tags.find((tag) => tag.includes(process.env.PROJECT_KEY));
    const jiraId = jiraTag ? jiraTag.replace(/@/g, "") : null;

    return jiraId;
}

/**
 * Gets and returns the test data for the test case with the specified name and filepath.
 * @returns The data of the test with the specified title.
 */
export function getTestCaseData(filepath?: string, testTitle?: string) {
    if (!filepath) {
        filepath = testData.testInfo.file;
    }

    if (!testTitle) {
        testTitle = testData.testInfo.title;
    }

    return new TestDataLoader(filepath).loadTestData()[testTitle];
}

/**
 * Checks if a parameter with the specifed name exists and has a value.
 * @param parameterName The name of the parameter to check.
 * @param dataIndex the index of the parameter in the data file, empty if there is only one instance of it.
 * @returns true if it exists and has value, false otherwise.
 */
export function parameterExistsAndHasValue(parameterName: string, dataIndex?: number): boolean {
    return getParameterValue(parameterName, dataIndex) !== "";
}

/**
 * Gets and returns the specified parameter's value from the corresponding JSON data file.
 * @param parameterName the name of the parameter to search in the JSON data file.
 * @param dataIndex the index of the parameter in the data file, empty if there is only one instance of it.
 * @returns the string parameter value if found, empty string otherwise.
 */
export function getStringParameter(parameterName: string, dataIndex?: number): string {
    return getParameterValue(parameterName, dataIndex).toString();
}

export function getDateParameter(parameterName: string, dataIndex?: number): string {
    return getParameterValue(parameterName, dataIndex).toString().toLowerCase() === "today" ? getCurrentDate() : getParameterValue(parameterName, dataIndex).toString();
}

/**
 * Gets and returns the specified parameter's value from the corresponding JSON data file.
 * @param parameterName the name of the parameter to search in the JSON data file.
 * @param dataIndex the index of the parameter in the data file, empty if there is only one instance of it.
 * @returns the number parameter value if found.
 */
export function getNumberParameter(parameterName: string, dataIndex?: number): number {
    return parseFloat(getParameterValue(parameterName, dataIndex));
}

/**
 * Gets and returns the specified parameter's value from the corresponding JSON data file.
 * @param parameterName the name of the parameter to search in the JSON data file.
 * @param dataIndex the index of the parameter in the data file, empty if there is only one instance of it.
 * @returns the string array parameter value if found, empty array otherwise.
 */
export function getMultipleStringParameter(parameterName: string, dataIndex?: number): string[] {
    return getParameterValue(parameterName, dataIndex);
}

/**
 * Exports the specified data contained in the map to a JSON file
 * @param exportedValues the data to export in the JSON file, entered as key-value pairs.
 */
export function exportTestData(exportedValues: Map<string, string>) {
    const exportedData = {};
    exportedValues.forEach((value, key) => {
        exportedData[key] = value;
    });

    const jsonData = JSON.stringify(exportedData, null, "\t");

    const filePath = path.join(__dirname, "../../../resources/testData/exported/", testData.testInfo.title.replace(":", "") + " [" + process.env.REGION + " " + process.env.ENV + "] " + getCurrentDateTime().replace(":", "_") + ".json");

    fs.writeFileSync(filePath, jsonData);
    console.log("Parameters of test case '" + testData.testInfo.title + "' were exported successfully.");
}

/**
 * Sets a new parameter or updates the value of it if the parameter already exists in the JSON data file with the specified filename.
 * @param filepath the path of the JSON file name to edit (e.g.  path.join(__dirname, '../../../resources/testData/properties', "TS_UI_DocViewer.json")).
 * @param testTitle the title of the test to search the parameter in (e.g. "WVENH-54272: Doc Viewer Upload")
 * @param parameterName the name of the parameter to create or update its existing value.
 * @param parameterValue the new parameter value to set.
 * @param dataIndex the index of the parameter in the data file, empty if there is only one instance of it.
 */
export function setParameterValue(filepath: string, testTitle: string, parameterName: string, parameterValue: any, dataIndex?: number) {
    if (!filepath.endsWith(".json")) {
        filepath += ".json";
    }

    let existingData: any;
    try {
        existingData = JSON.parse(fs.readFileSync(filepath, "utf8"));
    } catch (error) {
        //Correction in case the data file is not region specific but the region is incorrectly included in the filePath
        filepath = filepath.replace(process.env.REGION, "");
        existingData = JSON.parse(fs.readFileSync(filepath, "utf8"));
    }

    const selectedParameterName = dataIndex ? `${parameterName}.${dataIndex}` : parameterName;

    if (existingData[testTitle] && existingData[testTitle].hasOwnProperty(selectedParameterName)) {
        const oldParameterValue = existingData[testTitle][selectedParameterName];
        existingData[testTitle][selectedParameterName] = parameterValue;

        const jsonString = JSON.stringify(existingData, null, "\t");
        const updatedJsonString = jsonString.replace(new RegExp(`("(?:${selectedParameterName}|${selectedParameterName.replace(".", "\\.")})"):\\s*"([^"]+)"`, "gm"), `$1: "${parameterValue}"`);
        fs.writeFileSync(filepath, updatedJsonString);

        console.log("Parameter '" + selectedParameterName + "' value has been changed from '" + oldParameterValue + "' to '" + parameterValue + "'.");
    } else {
        if (!existingData.hasOwnProperty(testTitle)) {
            existingData[testTitle] = {};
        }

        existingData[testTitle][selectedParameterName] = parameterValue;

        const jsonString = JSON.stringify(existingData, null, "\t");
        fs.writeFileSync(filepath, jsonString);

        console.log("Parameter '" + selectedParameterName + "' with value '" + parameterValue + "' has been added to the JSON file under test title '" + testTitle + "'.");
    }
}

/**
 * Gets and returns the specified parameter's value from the corresponding JSON data file.
 * @param parameterName the name of the parameter to search in the JSON data file.
 * @param dataIndex the index of the parameter in the data file, empty if there is only one instance of it.
 * @returns the array parameter value if found, empty otherwise.
 */
function getParameterValue(parameterName: string, dataIndex?: number) {
    const testData = getTestCaseData();
    const selectedParameterName = dataIndex ? parameterName + "." + dataIndex.toString() : parameterName;
    const parameterValue = testData !== undefined && typeof testData[selectedParameterName] !== "undefined" && testData[selectedParameterName] !== null ? testData[selectedParameterName] : "";
    return parameterValue;
}

/**
 * Flattens the selected JSON data file and converts it into a Map of full_path -> value.
 * @param object the JSON object.
 * @returns the derived Map object.
 */
export function getFlatObjectMap(object: Object) {
    function iter(o, p) {
        if (o && typeof o === 'object') {
            Object.keys(o).forEach((k) => {
                iter(o[k], p.concat(k));
            });
            return;
        }
        path[p.join('.')] = o;
    }

    var path = {};
    iter(object, []);
    return new Map(Object.entries(path));
}
