/// <reference types="bn.js" />
/// <reference types="node" />
import CurrencyValueMap from './CurrencyValueMap';
import { BigNumber } from '../utils/types/BigNumber';
export declare const VERSION_CURRENT: import("bn.js");
export declare const VERSION_FIRSTVALID: import("bn.js");
export declare const VERSION_LASTVALID: import("bn.js");
export declare const VERSION_MULTIVALUE: import("bn.js");
export default class TokenOutput {
    version: BigNumber;
    reserve_values: CurrencyValueMap;
    constructor(data?: {
        values?: CurrencyValueMap;
        version?: BigNumber;
    });
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer): void;
    firstCurrency(): any;
    firstValue(): any;
    getVersion(): import("bn.js");
    isValid(): boolean;
}
