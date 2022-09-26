import { VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../";
import { Challenge, ChallengeInterface } from "./Challenge";
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
    constructor(request: RequestInterface);
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
    toWalletDeeplinkUri(): string;
    static fromWalletDeeplinkUri(uri: string): Request;
}
