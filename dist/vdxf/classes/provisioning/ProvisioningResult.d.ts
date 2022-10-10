/// <reference types="node" />
import { VDXFObject } from "../..";
export interface ProvisioningResultInterface {
    state: string;
    error_key?: string;
    error_desc?: string;
    identity_address?: string;
    info_uri?: string;
    reservation_txid?: string;
    provisioning_txid?: string;
}
export declare class ProvisioningResult extends VDXFObject {
    state: string;
    error_key?: string;
    error_desc?: string;
    identity_address?: string;
    info_uri?: string;
    reservation_txid?: string;
    provisioning_txid?: string;
    constructor(result?: ProvisioningResultInterface);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
}
