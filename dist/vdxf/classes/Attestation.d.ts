/// <reference types="node" />
import { VDXFObject } from "../";
import { MMR } from "./MMR";
export interface AttestationData {
    attestationKey?: string;
    salt?: string;
    value?: string;
}
export declare class Attestation extends VDXFObject {
    components: Array<AttestationData>;
    signatures: {
        [attestor: string]: string;
    };
    mmr: MMR;
    constructor(vdxfkey?: string, data?: {
        components?: Array<AttestationData>;
        signatures?: {
            [attestor: string]: string;
        };
    });
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    createMMR(): Promise<MMR>;
    routeHash(): Promise<any>;
    getRoot(): Promise<any>;
    getProof(keys: Array<number>): Promise<AttestationProof>;
    getHash(n: AttestationData): Buffer;
    getHashes(): Array<Buffer>;
}
export declare class AttestationProof extends VDXFObject {
    component: Map<number, AttestationData>;
    mmr: MMR;
    constructor(vdxfkey?: string, data?: {
        component?: Map<number, AttestationData>;
        mmr?: MMR;
    });
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    routeHash(): Promise<any>;
    checkProof(): Promise<void>;
    getHash(key: any): Buffer;
}
