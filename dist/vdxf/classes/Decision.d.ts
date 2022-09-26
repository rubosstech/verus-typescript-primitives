import { VDXFObject } from "..";
import { OidcDecision } from "./oidc/OidcDecision";
import { Request, RequestInterface } from "./Request";
export interface DecisionInterface {
    decision_id: string;
    request: RequestInterface;
    created_at?: string;
    context?: {
        [key: string]: any;
    };
}
export declare class Decision extends VDXFObject {
    decision_id: string;
    context?: {
        [key: string]: any;
    };
    request: Request;
    created_at: string;
    constructor(decision: DecisionInterface);
    toOidcDecision(): OidcDecision;
    stringable(): {
        vdxfkey: string;
        decision_id: string;
        context: {
            [key: string]: any;
        };
        created_at: string;
        request: {
            vdxfkey: string;
            system_id: string;
            signing_id: string;
            signature: {
                vdxfkey: string;
                signature: string;
            };
            challenge: {
                vdxfkey: string;
                challenge_id: string;
                requested_access: string[];
                requested_access_audience: string[];
                subject: import("./Challenge").Subject[];
                alt_auth_factors: string[];
                session_id: string;
                attestations: null;
                redirect_uris: {
                    uri: string;
                    vdxfkey: string;
                }[];
                created_at: string;
                salt: string;
                context: {
                    [key: string]: any;
                };
            };
        };
    };
}
