export interface KafkaMessage {
    source_context: SourceContext;
    ingestion_context: IngestionContext;
}

export interface SourceContext {
    submission_number: string;
    rush_indicator: boolean;
    source_system_id: string;
    source_system_name: string;
    source_reference_number: string;
    source_reference_json: string;
    channel: string;
    queue_name: string;
    email_subject: string;
    priority: string;
}

export interface IngestionContext {
    use_case_name: string;
    use_case_id: string;
    status: string;
    stage: string;
    event_id: string;
    event_type: string;
    region: string;
    country: string;
    lob: string;
    product: string;
    user_name: string;
    event_level: string;
    vendor: string;
    message: string;
    start_datetime: string;
    end_datetime: string;
    event_timestamp: string;
    destination_reference_number: string;
    overwrite_existing_files: string;
    documents: Documents[];
}

export interface Documents {
    document_name: string;
    document_type: string;
    size: string;
    stage: string;
    mime_type: string;
    classification_type: string;
    uri: string;
    content: string;
}
