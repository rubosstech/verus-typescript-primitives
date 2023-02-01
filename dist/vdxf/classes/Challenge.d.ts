/// <reference types="node" />
import { Utf8DataVdxfObject, VDXFObject } from "../";
import { Context } from "./Context";
import { Hash160 } from "./Hash160";
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
export declare class Subject extends VDXFObject {
    data: Hash160 | string;
    readonly BASE58_SUBJECTS: {
        [x: string]: boolean;
    };
    constructor(data?: string, vdxfkey?: string);
    isBase58(): boolean;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        data: string | Hash160;
        vdxfkey: string;
    };
}
export declare class RequestedPermission extends Utf8DataVdxfObject {
    constructor(vdxfkey?: string);
}
export declare class Audience extends Utf8DataVdxfObject {
}
export declare class AltAuthFactor extends Utf8DataVdxfObject {
}
export declare class Attestation extends Utf8DataVdxfObject {
}
export interface ChallengeInterface {
    challenge_id: string;
    requested_access?: Array<RequestedPermission> | null;
    requested_access_audience?: Array<Audience> | null;
    subject?: Array<Subject>;
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
    requested_access_audience?: Array<RequestedPermission> | null;
    subject?: Array<Subject>;
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
        requested_access_audience: RequestedPermission[];
        subject: Subject[];
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
