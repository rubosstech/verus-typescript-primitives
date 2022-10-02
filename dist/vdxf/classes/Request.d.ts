/// <reference types="node" />
import { VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../";
import { Challenge, ChallengeInterface } from "./Challenge";
import { Hash160 } from "./Hash160";
export interface RequestInterface {
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignatureInterface;
    challenge: ChallengeInterface;
    vdxfkey?: string;
}
export declare class Request extends VDXFObject {
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignature;
    challenge: Challenge;
    constructor(request?: RequestInterface, vdxfid?: string);
    getSignedHash(): string;
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
    protected _dataByteLength(includeSystemId?: boolean, signer?: string): number;
    protected _toDataBuffer(includeSystemId?: boolean, signer?: string): Buffer;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    protected _fromDataBuffer(buffer: Buffer, offset?: number, version?: number, includeSystemId?: boolean, readChallenge?: boolean): number;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toWalletDeeplinkUri(): string;
    static fromWalletDeeplinkUri(uri: string): Request;
}
