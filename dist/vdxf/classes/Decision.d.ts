/// <reference types="node" />
import { VDXFObject } from "..";
import { Context } from "./Context";
import { Hash160 } from "./Hash160";
import { OidcDecision } from "./oidc/OidcDecision";
import { Request, RequestInterface } from "./Request";
export interface DecisionInterface {
    decision_id: string;
    request: RequestInterface;
    created_at: number;
    context?: Context;
    attestations?: Array<any>;
}
export declare class Decision extends VDXFObject {
    decision_id: string;
    context?: Context;
    request: Request;
    created_at: number;
    attestations: Array<any>;
    constructor(decision?: DecisionInterface);
    toOidcDecision(): OidcDecision;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    stringable(): {
        vdxfkey: string;
        decision_id: string;
        context: Context;
        created_at: number;
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
                requested_access: Hash160[];
                requested_access_audience: any[];
                subject: import("./Challenge").Subject[];
                alt_auth_factors: any[];
                session_id: string;
                attestations: any[];
                redirect_uris: {
                    uri: string;
                    vdxfkey: string;
                }[];
                created_at: number;
                salt: string;
                context: Context;
            };
        };
    };
}
