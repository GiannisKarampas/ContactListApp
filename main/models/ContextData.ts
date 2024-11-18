import {AxiosResponse} from "axios";

export class ContextData {
    stepDescription: string;
    lastResponse: AxiosResponse;
    id: String;
    testName: string;
    responseTime: number;
}