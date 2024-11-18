export interface ErrorResponse {
    type: string;
    title: string;
    status: string;
    detail: string;
    instance: string;
    timestamp: string;
    error: string;
    path: string
}

export class ErrorResponseClass implements ErrorResponse {
    type: string;
    title: string;
    status: string;
    detail: string;
    instance: string;
    timestamp: string;
    error: string;
    path: string;

    constructor(response: ErrorResponse) {
        this.type = response.type;
        this.title = response.title;
        this.status = response.status;
        this.detail = response.detail;
        this.instance = response.instance;
        this.timestamp = response.timestamp;
        this.error = response.error;
        this.path = response.path;
    }
}