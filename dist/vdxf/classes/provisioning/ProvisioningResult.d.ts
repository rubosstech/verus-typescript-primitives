/// <reference types="node" />
import { VDXFObject } from "../..";
export interface ProvisioningResultInterface {
    state: string;
    error_key?: string;
    error_desc?: string;
    identity_address?: string;
    system_id?: string;
    fully_qualified_name?: string;
    parent?: string;
    info_uri?: string;
    provisioning_txid?: string;
}
export declare class ProvisioningResult extends VDXFObject {
    state: string;
    error_key?: string;
    error_desc?: string;
    identity_address?: string;
    info_uri?: string;
    provisioning_txid?: string;
    system_id?: string;
    fully_qualified_name?: string;
    parent?: string;
    constructor(result?: ProvisioningResultInterface);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {};
}
