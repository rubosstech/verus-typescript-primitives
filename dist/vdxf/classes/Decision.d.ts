import { VDXFObject } from "../";
import { Request, RequestInterface } from "./Request";
export interface DecisionInterface {
    subject?: string;
    remember?: boolean;
    remember_for?: number;
    acr?: string;
    context?: {
        [key: string]: any;
    };
    force_subject_identifier?: string;
    error?: string;
    error_description?: string;
    error_hint?: string;
    error_debug?: string;
    status_code?: number;
    request: RequestInterface;
}
export declare class Decision extends VDXFObject {
    subject?: string;
    remember?: boolean;
    remember_for?: number;
    acr?: string;
    context?: {
        [key: string]: any;
    };
    force_subject_identifier?: string;
    error?: string;
    error_description?: string;
    error_hint?: string;
    error_debug?: string;
    status_code?: number;
    request: Request;
    constructor(decision: DecisionInterface);
    stringable(): {
        vdxfkey: string;
        subject: string;
        remember: boolean;
        remember_for: number;
        acr: string;
        context: {
            [key: string]: any;
        };
        force_subject_identifier: string;
        error: string;
        error_description: string;
        error_hint: string;
        error_debug: string;
        status_code: number;
        request: {
            vdxfkey: string;
            chain_id: string;
            signing_id: string;
            signature: {
                vdxfkey: string;
                signature: string;
            };
            challenge: {
                vdxfkey: string;
                uuid: string;
                client: {
                    vdxfkey: string;
                    client_id: string;
                    name: string;
                    redirect_uris: import("./Client").RedirectUri[];
                    grant_types: string[];
                    response_types: string[];
                    scope: string;
                    audience: string[];
                    owner: string;
                    policy_uri: string;
                    allowed_cors_origins: string[];
                    tos_uri: string;
                    client_uri: string;
                    logo_uri: string;
                    contacts: string[];
                    client_secret_expires_at: number;
                    subject_type: string;
                    token_endpoint_auth_method: string;
                    userinfo_signed_response_alg: string;
                    created_at: string;
                    updated_at: string;
                };
                requested_scope: string[];
                requested_access_token_audience: string[];
                skip: boolean;
                subject: string;
                oidc_context: {} | {
                    acr_values: string[];
                    display: string;
                    id_token_hint_claims: {
                        [key: string]: any;
                    };
                    login_hint: string;
                    ui_locales: string[];
                };
                request_url: string;
                login_challenge: string;
                login_session_id: string;
                acr: string;
                session_id: string;
            };
        };
    };
}
