import { VDXFKeyInterface } from './keys';
export * from './keys';
export * from './scopes';
export interface VDXFObjectInterface {
    vdxfkey: string;
    toString: () => string;
    stringable: () => {
        [key: string]: any;
    };
}
export interface VerusIDSignatureInterface {
    signature: string;
}
export declare class VDXFObject implements VDXFObjectInterface {
    vdxfkey: string;
    constructor(key: string);
    stringable(): {};
    toString(): string;
}
export declare class VerusIDSignature extends VDXFObject {
    signature: string;
    constructor(sig: VerusIDSignatureInterface, vdxfkey: VDXFKeyInterface);
    stringable(): {
        vdxfkey: string;
        signature: string;
    };
}
