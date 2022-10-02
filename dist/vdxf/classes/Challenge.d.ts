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
    stringable(): {
        uri: string;
        vdxfkey: string;
    };
}
export declare class Subject extends Utf8DataVdxfObject {
}
export interface ChallengeInterface {
    challenge_id: string;
    requested_access?: Array<Hash160> | null;
    requested_access_audience?: Array<any> | null;
    subject?: Array<Subject>;
    alt_auth_factors?: Array<any> | null;
    session_id?: string;
    attestations?: Array<any>;
    redirect_uris?: Array<RedirectUri>;
    created_at: number;
    salt?: string;
    context?: Context;
}
export declare class Challenge extends VDXFObject implements ChallengeInterface {
    challenge_id: string;
    requested_access?: Array<Hash160> | null;
    requested_access_audience?: Array<any> | null;
    subject?: Array<Subject>;
    alt_auth_factors?: Array<any> | null;
    session_id?: string;
    attestations?: Array<any>;
    redirect_uris?: Array<RedirectUri>;
    created_at: number;
    salt?: string;
    context?: Context;
    constructor(challenge?: ChallengeInterface, vdxfid?: string);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    stringable(): {
        vdxfkey: string;
        challenge_id: string;
        requested_access: Hash160[];
        requested_access_audience: any[];
        subject: Subject[];
        alt_auth_factors: any[];
        session_id: string;
        attestations: any[];
        redirect_uris: {
            uri: string;
            vdxfkey: string;
        }[];
        created_at: number;
        salt: string;
        context: Context;
    };
}
