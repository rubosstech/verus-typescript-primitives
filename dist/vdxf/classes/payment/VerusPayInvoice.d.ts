/// <reference types="bn.js" />
/// <reference types="node" />
import { VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../../";
import { VerusPayInvoiceDetails } from "./VerusPayInvoiceDetails";
export declare const VERUSPAY_VERSION_CURRENT: import("bn.js");
export declare const VERUSPAY_VERSION_FIRSTVALID: import("bn.js");
export declare const VERUSPAY_VERSION_LASTVALID: import("bn.js");
export declare const VERUSPAY_VERSION_SIGNED: import("bn.js");
export interface VerusPayInvoiceInterface {
    details: VerusPayInvoiceDetails;
    system_id?: string;
    signing_id?: string;
    signature?: VerusIDSignatureInterface;
}
export declare class VerusPayInvoice extends VDXFObject {
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignature;
    details: VerusPayInvoiceDetails;
    constructor(request?: VerusPayInvoiceInterface);
    isSigned(): boolean;
    setSigned(): void;
    getDetailsHash(signedBlockheight: number, signatureVersion?: number): Buffer;
    toJson(): {
        vdxfkey: string;
        system_id: string;
        signing_id: string;
        signature: {
            vdxfkey: string;
            signature: string;
        };
        details: {
            flags: string;
            amount: string;
            destination: string;
            requestedcurrencyid: string;
            expiryheight: string;
            maxestimatedslippage: string;
            acceptedsystems: string[];
        };
    };
    protected _dataByteLength(signer?: string): number;
    protected _toDataBuffer(signer?: string): Buffer;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    protected _fromDataBuffer(buffer: Buffer, offset?: number): number;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toWalletDeeplinkUri(): string;
    static fromWalletDeeplinkUri(uri: string): VerusPayInvoice;
    toQrString(): string;
    static fromQrString(qrstring: string): VerusPayInvoice;
}
