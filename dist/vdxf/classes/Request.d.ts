/// <reference types="node" />
import { VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../";
import { Challenge, ChallengeInterface } from "./Challenge";
import { Hash160 } from "./Hash160";
export interface RequestInterface {
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignatureInterface;
    challenge: ChallengeInterface;
}
export declare class Request extends VDXFObject {
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignature;
    challenge: Challenge;
    constructor(request?: RequestInterface);
    getSignedData(): string;
    stringable(): {
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
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toWalletDeeplinkUri(): string;
    static fromWalletDeeplinkUri(uri: string): Request;
}
