/// <reference types="node" />
import { VDXFKeyInterface } from './keys';
export * from './keys';
export * from './scopes';
export interface VDXFObjectInterface {
    vdxfkey: string;
    toString: () => string;
    toJson: () => {
        [key: string]: any;
    };
    toBuffer: () => Buffer;
    toDataBuffer: () => Buffer;
    fromDataBuffer: (buffer: Buffer, offset: number) => number;
    fromBuffer: (buffer: Buffer, offset: number) => number;
    dataByteLength: () => number;
    byteLength: () => number;
}
export interface VerusIDSignatureInterface {
    signature: string;
}
export declare class VDXFObject implements VDXFObjectInterface {
    vdxfkey: string;
    version: number;
    constructor(key?: string);
    toJson(): {};
    toString(): string;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    fromBuffer(buffer: Buffer, offset?: number): number;
    byteLength(): number;
    toBuffer(): Buffer;
}
export declare class Utf8DataVdxfObject extends VDXFObject {
    data: string;
    constructor(data?: string, vdxfkey?: string);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        data: string;
        vdxfkey: string;
    };
}
export declare class VerusIDSignature extends VDXFObject {
    signature: string;
    constructor(sig?: VerusIDSignatureInterface, vdxfkey?: VDXFKeyInterface);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        vdxfkey: string;
        signature: string;
    };
}
