
import {ErrorResponse, ErrorResponseClass} from './ErrorResponse';

export interface AuthResponse extends ErrorResponse {
    accessToken: string;
    tokenType: string;
    refreshToken: string;
    expiresIn: number;
    scope: string;
    jti: string;
    expiresOn: string;
    extExpiresIn: string;
    resource: string;
    notBefore: string;
}

export class AuthResponseClass extends ErrorResponseClass implements AuthResponse {
    accessToken: string;
    tokenType: string;
    refreshToken: string;
    expiresIn: number;
    scope: string;
    jti: string;
    expiresOn: string;
    extExpiresIn: string;
    resource: string;
    notBefore: string;

    constructor(response: any) {
        super(response);
        this.accessToken = response.access_token;
        this.tokenType = response.token_type;
        this.refreshToken = response.refresh_token;
        this.expiresIn = response.expires_in;
        this.scope = response.scope;
        this.jti = response.jti;
        this.expiresOn = response.expires_on;
        this.extExpiresIn = response.ext_expires_in;
        this.resource = response.resource;
        this.notBefore = response.not_before;
    }
}
