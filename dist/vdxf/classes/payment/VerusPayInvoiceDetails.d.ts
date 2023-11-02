/// <reference types="bn.js" />
/// <reference types="node" />
import { BigNumber } from '../../../utils/types/BigNumber';
import { TransferDestination } from '../../../pbaas/TransferDestination';
export declare const VERUSPAY_INVALID: import("bn.js");
export declare const VERUSPAY_VALID: import("bn.js");
export declare const VERUSPAY_ACCEPTS_CONVERSION: import("bn.js");
export declare const VERUSPAY_ACCEPTS_NON_VERUS_SYSTEMS: import("bn.js");
export declare const VERUSPAY_EXPIRES: import("bn.js");
export declare class VerusPayInvoiceDetails {
    flags: BigNumber;
    amount: BigNumber;
    destination: TransferDestination;
    requestedcurrencyid: string;
    expiryheight: BigNumber;
    mindestcurrencyinreserve: BigNumber;
    minsourcedestweightratio: BigNumber;
    acceptedsystems: Array<string>;
    constructor(data?: {
        flags?: BigNumber;
        amount: BigNumber;
        destination: TransferDestination;
        requestedcurrencyid: string;
        expiryheight?: BigNumber;
        mindestcurrencyinreserve?: BigNumber;
        minsourcedestweightratio?: BigNumber;
        acceptedsystems?: Array<string>;
    });
    setFlags(flags: {
        acceptsConversion?: boolean;
        acceptsNonVerusSystems?: boolean;
        expires?: boolean;
    }): void;
    toSha256(): Buffer;
    acceptsConversion(): boolean;
    acceptsNonVerusSystems(): boolean;
    expires(): boolean;
    isValid(): boolean;
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        flags: string;
        amount: string;
        destination: string;
        requestedcurrencyid: string;
        expiryheight: string;
        mindestcurrencyinreserve: string;
        minsourcedestweightratio: string;
        acceptedsystems: string[];
    };
}
