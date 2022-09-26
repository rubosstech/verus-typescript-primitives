import { Decision, DecisionInterface } from "./Decision";
import { VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../";
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
    constructor(response: ResponseInterface);
    getSignedData(): string;
    stringable(): {
        vdxfkey: string;
        system_id: string;
        signature: VerusIDSignature;
        signing_id: string;
        decision: {
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
    };
}
