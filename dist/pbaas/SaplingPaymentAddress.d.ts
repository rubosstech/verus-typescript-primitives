/// <reference types="node" />
export declare class SaplingPaymentAddress {
    d: Buffer;
    pk_d: Buffer;
    constructor(data?: {
        d: Buffer;
        pk_d: Buffer;
    });
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    static fromAddressString(address: string): SaplingPaymentAddress;
}
