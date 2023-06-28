import { VDXFObject } from "../";
export interface MerkleBranch {
    nIndex?: number;
    branch?: Array<string>;
}
export interface AttestationData extends VDXFObject {
    type?: number;
    key?: string;
    salt?: string;
    value?: string;
    hash?: string;
}
export interface AttestationSignature extends VDXFObject {
    signatures: Array<string>;
    attestors: Array<string>;
}
export declare class Attestation extends VDXFObject {
    type: number;
    branch: MerkleBranch;
    components: Array<AttestationData>;
    proof: AttestationSignature;
    constructor(vdxfkey?: string);
}
