export interface stpJSON {
    metadata: Metadata;
    fields: Field[];
    stp_config: StpConfig[];
}

interface Metadata {
    submission_number: string;
    is_eligible: boolean;
    lob: string;
}

interface Field {
    field_name: string;
    confidence_score: string;
    confidence_threshold: string;
    is_core: boolean;
    stp_rule_criteria: string;
    is_eligible: boolean;
}

interface StpConfig {
    lob_code: string;
    field_name: string;
    is_stp_eligible: boolean;
    is_core: boolean;
    confidence_threshold: string;
    stp_rule_code: string;
    ext_value_json_path: string;
    ext_score_json_path: string;
    enrich_value_json_path: string;
    enrich_score_json_path: string;
}
