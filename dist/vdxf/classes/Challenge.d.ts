/// <reference types="node" />
import { Utf8DataVdxfObject, VDXFObject, Utf8OrBase58Object } from "../";
import { Context } from "./Context";
export declare class RedirectUri extends VDXFObject {
    uri: string;
    constructor(uri?: string, vdxfkey?: string);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        uri: string;
        vdxfkey: string;
    };
}
export declare class Subject extends Utf8OrBase58Object {
    constructor(data?: string, vdxfkey?: string);
}
export declare class ProvisioningInfo extends Utf8OrBase58Object {
    constructor(data?: string, vdxfkey?: string);
}
export declare class Audience extends Utf8DataVdxfObject {
}
export declare class AltAuthFactor extends Utf8DataVdxfObject {
}
export declare class Attestation extends Utf8DataVdxfObject {
    constructor(data?: string, vdxfkey?: string);
}
export interface ChallengeInterface {
    challenge_id: string;
    requested_access?: Array<RequestedPermission> | null;
    requested_access_audience?: Array<Audience> | null;
    subject?: Array<Subject>;
    provisioning_info?: Array<ProvisioningInfo>;
    alt_auth_factors?: Array<AltAuthFactor> | null;
    session_id?: string;
    attestations?: Array<Attestation>;
    redirect_uris?: Array<RedirectUri>;
    created_at: number;
    skip?: boolean;
    salt?: string;
    context?: Context;
}
export declare class Challenge extends VDXFObject implements ChallengeInterface {
    challenge_id: string;
    requested_access?: Array<RequestedPermission> | null;
    requested_access_audience?: Array<Audience> | null;
    subject?: Array<Subject>;
    provisioning_info?: Array<ProvisioningInfo>;
    alt_auth_factors?: Array<AltAuthFactor> | null;
    session_id?: string;
    attestations?: Array<Attestation>;
    redirect_uris?: Array<RedirectUri>;
    created_at: number;
    skip?: boolean;
    salt?: string;
    context?: Context;
    constructor(challenge?: ChallengeInterface, vdxfkey?: string);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        vdxfkey: string;
        challenge_id: string;
        requested_access: RequestedPermission[];
        requested_access_audience: Audience[];
        subject: Subject[];
        provisioning_info: ProvisioningInfo[];
        alt_auth_factors: AltAuthFactor[];
        session_id: string;
        attestations: Attestation[];
        redirect_uris: {
            uri: string;
            vdxfkey: string;
        }[];
        created_at: number;
        salt: string;
        context: Context;
        skip: boolean;
    };
}
export declare class AttestationRequest extends VDXFObject {
    acceptedattestors?: Array<String>;
    attestationkeys?: Array<String>;
    attestorfilters?: Array<String>;
    constructor(vdxfkey: string, data: any);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        vdxfkey: string;
        acceptedattestors: String[];
        attestationkeys: String[];
        attestorfilters: String[];
    };
}
export declare class BasicPermission extends Utf8DataVdxfObject {
    constructor(data?: string, vdxfkey?: string);
}
export declare class RequestedPermission extends VDXFObject {
    constructor(vdxfkey?: string, data?: any);
}
