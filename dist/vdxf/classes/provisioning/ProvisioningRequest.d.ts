/// <reference types="node" />
import { VerusIDSignatureInterface } from "../../";
import { Request } from "../Request";
import { ProvisioningChallenge, ProvisioningChallengeInterface } from "./ProvisioningChallenge";
export interface ProvisioningRequestInterface {
    signing_address?: string;
    signature?: VerusIDSignatureInterface;
    challenge: ProvisioningChallengeInterface;
}
export declare class ProvisioningRequest extends Request {
    signing_address?: string;
    challenge: ProvisioningChallenge;
    constructor(request?: ProvisioningRequestInterface);
    stringable(): {
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
            requested_access: import("..").Hash160[];
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
            context: import("../Context").Context;
        };
    };
    getHash(): Buffer;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toWalletDeeplinkUri(): string;
    static fromWalletDeeplinkUri(uri: string): Request;
}
