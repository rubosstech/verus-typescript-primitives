/// <reference types="node" />
/// <reference types="bn.js" />
import { BigNumber } from '../utils/types/BigNumber';
import { IdentityID } from './IdentityID';
import { KeyID } from './KeyID';
import { NoDestination } from './NoDestination';
import { PubKey } from './PubKey';
export interface TxDestinationVariantInterface {
    new (hash?: Buffer): TxDestinationVariant;
}
export declare type TxDestinationVariant = IdentityID | KeyID | NoDestination | PubKey;
export declare class TxDestination {
    type: BigNumber;
    data: TxDestinationVariant;
    static TYPE_INVALID: import("bn.js");
    static TYPE_PK: import("bn.js");
    static TYPE_PKH: import("bn.js");
    static TYPE_SH: import("bn.js");
    static TYPE_ID: import("bn.js");
    static TYPE_INDEX: import("bn.js");
    static TYPE_QUANTUM: import("bn.js");
    static TYPE_LAST: import("bn.js");
    constructor(data?: TxDestinationVariant, type?: BigNumber);
    getByteLength(): number;
}
