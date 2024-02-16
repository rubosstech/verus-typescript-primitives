/// <reference types="node" />
import { VDXFObject, VerusIDSignature } from "../";
import { CMerkleMountainRange, CMMRProof } from "./MMR";
import { AttestationData } from './attestationData';
export declare class Attestation extends VDXFObject {
    static TYPE_STRING: number;
    static TYPE_BYTES: number;
    static TYPE_BASE64: number;
    static TYPE_URL: number;
    data: AttestationData;
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignature;
    mmr: CMerkleMountainRange;
    constructor(data?: {
        data?: AttestationData;
        signature?: VerusIDSignature;
        mmr?: CMerkleMountainRange;
        system_id: string;
        signing_id: string;
    }, vdxfkey?: string);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    createMMR(): CMerkleMountainRange;
    rootHash(): Buffer;
    getProof(keys: Array<number>): CPartialAttestationProof;
    checkProof(): Promise<void>;
    getHash(key: any): Buffer;
}
export declare class CPartialAttestationProof extends VDXFObject {
    private EType;
    type: number;
    proof: CMMRProof;
    componentsArray: AttestationData;
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignature;
    constructor(data?: {
        proof?: CMMRProof;
        componentsArray?: AttestationData;
        system_id: string;
        signing_id: string;
    }, vdxfkey?: string);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    checkProof(item: number): Buffer;
}
