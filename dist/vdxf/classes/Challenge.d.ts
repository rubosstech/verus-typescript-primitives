import { VDXFObject } from "../";
export declare class RedirectUri extends VDXFObject {
    uri: string;
    constructor(uri: string, vdxfkey: string);
    stringable(): {
        uri: string;
        vdxfkey: string;
    };
}
export declare class Subject extends VDXFObject {
    data: string;
    constructor(data: string, vdxfkey: string);
    stringable(): {
        data: string;
        vdxfkey: string;
    };
}
export interface ChallengeInterface {
    challenge_id: string;
    requested_access?: Array<string> | null;
    requested_access_audience?: Array<string> | null;
    subject?: Array<Subject>;
    alt_auth_factors?: Array<string> | null;
    session_id?: string;
    attestations?: null;
    redirect_uris?: Array<RedirectUri>;
    created_at?: string;
    salt: string;
    context: {
        [key: string]: any;
    };
}
export declare class Challenge extends VDXFObject implements ChallengeInterface {
    challenge_id: string;
    requested_access?: Array<string> | null;
    requested_access_audience?: Array<string> | null;
    subject?: Array<Subject>;
    alt_auth_factors?: Array<string> | null;
    session_id?: string;
    attestations?: null;
    redirect_uris?: Array<RedirectUri>;
    created_at?: string;
    salt: string;
    context: {
        [key: string]: any;
    };
    constructor(challenge: ChallengeInterface);
    stringable(): {
        vdxfkey: string;
        challenge_id: string;
        requested_access: string[];
        requested_access_audience: string[];
        subject: Subject[];
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
}
