/// <reference types="node" />
import { VDXFObject } from "../";
import { MMR } from "./MMR";
export interface AttestationData {
    type?: number;
    attestationKey?: string;
    salt?: string;
    value?: string;
    hash?: string;
}
export declare class Attestation extends VDXFObject {
    type: number;
    nIndex: number;
    components: Array<AttestationData>;
    signatures: {
        [attestor: string]: string;
    };
    mmr: MMR;
    constructor(vdxfkey?: string, data?: {
        type?: number;
        nIndex?: number;
        components?: Array<AttestationData>;
        signatures?: {
            [attestor: string]: string;
        };
    });
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    getMMR(): Promise<MMR>;
    routeHash(): Promise<void>;
    getHash(n: AttestationData): Buffer;
    sortHashes(): Array<Buffer>;
}
