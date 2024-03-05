/// <reference types="node" />
import { Hash160 } from "../vdxf/classes";
export declare class NoDestination extends Hash160 {
    constructor();
    fromBuffer(buffer: Buffer, varlength?: boolean, offset?: number): number;
}
