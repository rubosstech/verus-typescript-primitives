/// <reference types="node" />
import { Hash160 } from '../vdxf/classes';
export declare class KeyID extends Hash160 {
    constructor(hash?: Buffer);
    fromBuffer(buffer: Buffer, varlength?: boolean, offset?: number): number;
}
