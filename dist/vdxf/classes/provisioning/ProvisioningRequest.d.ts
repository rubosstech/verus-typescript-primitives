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
            context: import("..").Context;
            skip: boolean;
        };
    };
    getChallengeHash(): Buffer;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toWalletDeeplinkUri(): string;
    static fromWalletDeeplinkUri(uri: string): Request;
}
