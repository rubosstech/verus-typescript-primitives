/// <reference types="node" />
import { Decision } from "../Decision";
import { Context } from "../Context";
import { ProvisioningRequest } from "./ProvisioningRequest";
import { ProvisioningResult } from "./ProvisioningResult";
export interface ProvisioningDecisionInterface {
    decision_id: string;
    created_at: number;
    salt?: string;
    result?: ProvisioningResult;
    request: ProvisioningRequest;
    context?: Context;
}
export declare class ProvisioningDecision extends Decision implements ProvisioningDecisionInterface {
    result?: ProvisioningResult;
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
        result: {};
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
                requested_access: import("../Challenge").RequestedPermission[];
                requested_access_audience: import("../Challenge").RequestedPermission[];
                subject: import("..").Subject[];
                alt_auth_factors: import("../Challenge").AltAuthFactor[];
                session_id: string;
                attestations: import("../Challenge").Attestation[];
                redirect_uris: {
                    uri: string;
                    vdxfkey: string;
                }[];
                created_at: number;
                salt: string;
                context: Context;
                skip: boolean;
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
