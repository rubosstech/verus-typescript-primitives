/// <reference types="bn.js" />
/// <reference types="node" />
import { BigNumber } from '../utils/types/BigNumber';
import { TxDestination } from './TxDestination';
export declare const PRINCIPAL_DEFAULT_FLAGS: import("bn.js");
export declare const PRINCIPAL_VERSION_INVALID: import("bn.js");
export declare const PRINCIPAL_VERSION_CURRENT: import("bn.js");
export declare class Principal {
    flags: BigNumber;
    version: BigNumber;
    min_sigs: BigNumber;
    primary_addresses?: Array<TxDestination>;
    constructor(data?: {
        version?: BigNumber;
        flags?: BigNumber;
        min_sigs?: BigNumber;
        primary_addresses?: Array<TxDestination>;
    });
    private getSelfByteLength;
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
}
