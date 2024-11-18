import {webService, WebService} from "@main/services/WebService";
import {stpJSON} from "../interfaces/StpObj";
import {expect} from "@playwright/test";
import {Logger} from "@utils/common/Logger.utils";
import {Applications, UrlHandler} from "@utils/common/UrlHandler.utils";
import {RestEndpoints} from "@utils/apiDomains/RestEndpoints";

export const logger = Logger.loggerSetup();
const jsonPath = require("jsonpath");
const isEmpty = (value) => value === undefined || value === null || value === "";

/**
 * Function that receives a submission number and returns the response of the STP service.
 *
 * @param {string} submissionId The submission number that is checked through the STP service.
 * @returns {Promise<stpJSON>} The STP json response.
 */
export async function getStpJsonData(submissionId: string): Promise<stpJSON> {
    const service: WebService = await webService();
    const restInstance = service.rest;

    const body = `{"source_context": {"submission_number": "${submissionId}"}}`;
    const url = UrlHandler.setUrlPerEnvironment(process.env.CONFIG, Applications.STP);

    let stpJson = await restInstance.postRequestWithFullUrl(url, {}, body);
    return JSON.parse(JSON.stringify(stpJson.data));
}

/**
 * Function that receives an STP json and returns true when all the fields and the metadata eligibility are true or
 * at least one of the fields and the metadata eligibility are false.
 *
 * @param {stpJSON} stpJson The STP json response from the STP service.
 * @returns {boolean} Return true if the Eligibility flag in metadata is correct.
 */
export function checkStpFieldsEligibility(stpJson: stpJSON): boolean {
    const allFieldsEligible = stpJson.fields.every((field) => field.is_eligible);
    const metadataEligible = stpJson.metadata.is_eligible;

    if ((allFieldsEligible && metadataEligible) || (!allFieldsEligible && !metadataEligible)) {
        return true;
    } else if ((allFieldsEligible && !metadataEligible) || (!allFieldsEligible && metadataEligible)) {
        logger.info("STP eligibility flags are not correct");
        return false;
    }
}

/**
 * Function that receives an STP json and returns true when all the fields have correct confidence threshold.
 *
 * @param {stpJSON} stpJson The STP json response from the STP service.
 * @returns {boolean} Return true if the confidence threshold is correct on all fields.
 */
export function checkStpConfidenceThreshold(stpJson: stpJSON): boolean {
    const fields = stpJson.fields;
    const stpConfig = stpJson.stp_config;
    let confidenceThreshold: boolean = true;

    stpConfig.forEach((obj) => {
        let fieldRule = jsonPath.value(fields, `$[?(@.field_name=="${obj.field_name}")].stp_rule_criteria`);
        let fieldThreshold = jsonPath.value(fields, `$[?(@.field_name=="${obj.field_name}")].confidence_threshold`);

        if (fieldThreshold !== obj.confidence_threshold) {
            if ((fieldRule == "NOT NULL" || fieldRule == "NOT REQUIRED" || fieldRule == "VALUE AS IS") && fieldThreshold !== null) {
                logger.info("Different confidence threshold found for field: " + obj.field_name);
                confidenceThreshold = false;
            }
        }
    });

    if (confidenceThreshold) {
        return true;
    } else {
        return false;
    }
}

/**
 * Function that receives an STP json and returns true when all the fields have correct is_core flag.
 *
 * @param {stpJSON} stpJson The STP json response from the STP service.
 * @returns {boolean} Return true if the is_core flag is correct on all fields.
 */
export function checkCoreFlag(stpJson: stpJSON): boolean {
    const fields = stpJson.fields;
    const stpConfig = stpJson.stp_config;

    const mapFields = new Map();
    fields.forEach((obj) => mapFields.set(obj.field_name, obj.is_core));

    let isCoreCheck: boolean = true;

    stpConfig.forEach((obj) => {
        if (mapFields.has(obj.field_name) && mapFields.get(obj.field_name) !== obj.is_core) {
            isCoreCheck = false;
            logger.info("Different is_core flag found for field: " + obj.field_name);
        }
    });

    if (isCoreCheck) {
        return true;
    } else {
        return false;
    }
}

/**
 * Function that receives a submission number as a string and returns the 1700 json.
 *
 * @param {string} submission_number The submission number for the 1700 json.
 * @returns Return the 1700 json of the given submission number.
 */
export async function getStageJsonData(submission_number: string) {
    const service: WebService = await webService();
    const restInstance = service.rest;
    const url = `${RestEndpoints.DATA_ORCHESTRATION}/file/download`;
    const queryParams = {uri: `${process.env.ADLS_URL}/${process.env.ENV.toLowerCase()}/underwriter/${submission_number}/curated/1700/files.gz`};

    let json1700 = await restInstance.getRequestWithFullUrl(url, null, null, queryParams);

    expect(json1700.status).toBe(200);

    return json1700;
}

/**
 * Function that checks if all fields have correct confidence score based on each field stp_rule.
 * The score is checked if it's the same on the STP json and the 1700 json.
 * If any field has different score the test that calls this function will fail.
 *
 * @param {stpJSON} stpJson The STP json of a submission.
 * @param json1700 The 1700 json of a submission.
 */
export function checkFieldsConfidenceScore(stpJson, json1700) {
    const fields = stpJson.fields;

    fields.forEach((obj) => {
        const enrichPath = jsonPath.value(stpJson, `stp_config[?(@.field_name=="${obj.field_name}")].enrich_value_json_path`);
        const extPath = jsonPath.value(stpJson, `stp_config[?(@.field_name=="${obj.field_name}")].ext_value_json_path`);
        const enrichScorePath = jsonPath.value(stpJson, `stp_config[?(@.field_name=="${obj.field_name}")].enrich_score_json_path`);
        const extScorePath = jsonPath.value(stpJson, `stp_config[?(@.field_name=="${obj.field_name}")].ext_score_json_path`);
        let extractedScore;

        logger.info("Field " + obj.field_name + " with rule " + obj.stp_rule_criteria);

        switch (obj.stp_rule_criteria) {
            case "ENRICHMENT OR EXTRACTION":
                if (!isEmpty(enrichScorePath)) {
                    extractedScore = jsonPath.value(json1700.data, enrichScorePath);
                } else if (!isEmpty(extScorePath)) {
                    extractedScore = jsonPath.value(json1700.data, extScorePath);
                } else {
                    logger.info("Can not extract value for field " + obj.field_name + " no path is set on config");
                }

                if (isEmpty(extractedScore)) {
                    expect.soft(obj.confidence_score).not.toBeTruthy();
                } else {
                    expect.soft(extractedScore).toBe(obj.confidence_score);
                }
                break;
            case "EXTRACTION OR ENRICHMENT":
                if (!isEmpty(extScorePath)) {
                    extractedScore = jsonPath.value(json1700.data, extScorePath);
                } else if (!isEmpty(enrichScorePath)) {
                    extractedScore = jsonPath.value(json1700.data, enrichScorePath);
                } else {
                    logger.info("Can not extract value for field " + obj.field_name + " no path is set on config");
                }

                if (isEmpty(extractedScore)) {
                    expect.soft(obj.confidence_score).not.toBeTruthy();
                } else {
                    expect.soft(extractedScore).toBe(obj.confidence_score);
                }
                break;
            case "ENRICHMENT":
                if (enrichPath) {
                    extractedScore = jsonPath.value(json1700.data, enrichScorePath);
                    if (isEmpty(extractedScore)) {
                        expect.soft(obj.confidence_score).not.toBeTruthy();
                    } else {
                        expect.soft(extractedScore).toBe(obj.confidence_score);
                    }
                } else {
                    logger.info("Can not verify field " + obj.field_name + " not all info are present");
                }
                break;
            case "EXTRACTION":
                if (extScorePath) {
                    extractedScore = jsonPath.value(json1700.data, extScorePath);
                    if (isEmpty(extractedScore)) {
                        expect.soft(obj.confidence_score).not.toBeTruthy();
                    } else {
                        expect.soft(extractedScore).toBe(obj.confidence_score);
                    }
                } else {
                    logger.info("Can not verify field " + obj.field_name + " not all info are present");
                }
                break;
            case "NOT NULL":
                let isPathExtracted = true;
                let isExtPathExtracted = true;
                let isEnrichPathExtracted = true;

                if (enrichPath) {
                    let enrichPaths = jsonPath.query(json1700.data, enrichPath);

                    if (isObjectEmpty(enrichPaths)) {
                        isEnrichPathExtracted = false;
                    } else {
                        enrichPaths.forEach((value) => {
                            if (isEmpty(value)) {
                                isEnrichPathExtracted = false;
                            }
                        });
                    }
                }

                if (extPath) {
                    let extPaths = jsonPath.query(json1700.data, extPath);

                    if (isObjectEmpty(extPaths)) {
                        isExtPathExtracted = false;
                    } else {
                        extPaths.forEach((value) => {
                            if (isEmpty(value)) {
                                isExtPathExtracted = false;
                            }
                        });
                    }
                }

                if (isExtPathExtracted === false || isEnrichPathExtracted === false) {
                    isPathExtracted = false;
                }

                expect.soft(obj.is_eligible).toBe(isPathExtracted);
                break;
            case "NOT REQUIRED":
                expect.soft(obj.is_eligible).toBe(true);
            case "VALUE AS IS":
                expect.soft(obj.is_eligible).toBe(true);
                break;
            default:
                logger.info("Field " + obj.field_name + " is unknown type: " + obj.stp_rule_criteria);
        }
    });
}

/**
 * Function that checked is an object is empty or all attributes are null.
 *
 * @param {object} obj The object to check if is empty.
 * @returns Return true when the object is empty or all attributes are null.
 */
function isObjectEmpty(obj: object): boolean {
    if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
    } else {
        return false;
    }
}