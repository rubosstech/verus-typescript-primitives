/// <reference types="node" />
import { Decision, DecisionInterface } from "./Decision";
import { VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../";
import { Hash160 } from "./Hash160";
export interface ResponseInterface {
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignatureInterface;
    decision: DecisionInterface;
}
export declare class Response extends VDXFObject {
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignature;
    decision: Decision;
    constructor(response?: ResponseInterface, vdxfid?: string);
    getHash(signedBlockheight: number): Buffer;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    stringable(): {
        vdxfkey: string;
        system_id: string;
        signature: VerusIDSignature;
        signing_id: string;
        decision: {
            vdxfkey: string;
            decision_id: string;
            context: {
                kv: {
                    [key: string]: string;
                };
                vdxfkey: string;
            };
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
                    context: import("./Context").Context;
                };
            };
        };
    };
}
