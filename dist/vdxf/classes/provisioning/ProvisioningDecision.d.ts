/// <reference types="node" />
import { Decision } from "../Decision";
import { Context } from "../Context";
import { ProvisioningRequest } from "./ProvisioningRequest";
import { Hash160 } from "../Hash160";
export declare class ProvisioningResult extends Context {
    constructor(kv?: {
        [key: string]: string;
    });
}
export interface ProvisioningDecisionInterface {
    decision_id: string;
    created_at: number;
    salt?: string;
    error_key?: string;
    error_desc?: string;
    result?: ProvisioningResult;
    info_text?: string;
    request: ProvisioningRequest;
    context?: Context;
}
export declare class ProvisioningDecision extends Decision implements ProvisioningDecisionInterface {
    error_key?: string;
    error_desc?: string;
    result?: ProvisioningResult;
    info_text?: string;
    salt?: string;
    request: ProvisioningRequest;
    constructor(decision?: ProvisioningDecisionInterface);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    stringable(): {
        vdxfkey: string;
        decision_id: string;
        created_at: number;
        salt: string;
        error_key: string;
        error_desc: string;
        result: {
            kv: {
                [key: string]: string;
            };
            vdxfkey: string;
        };
        info_text: string;
        request: {
            vdxfkey: string;
            system_id: any;
            signing_address: string;
            signing_id: any;
            signature: {
                vdxfkey: string;
                signature: string;
            };
            challenge: {
                vdxfkey: string;
                challenge_id: string;
                requested_access: Hash160[];
                requested_access_audience: any[];
                subject: import("../Challenge").Subject[];
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
        context: {
            kv: {
                [key: string]: string;
            };
            vdxfkey: string;
        };
    };
    fromDataBuffer(buffer: Buffer, offset?: number): number;
}
