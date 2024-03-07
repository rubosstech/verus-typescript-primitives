/// <reference types="bn.js" />
/// <reference types="node" />
import { BigNumber } from '../utils/types/BigNumber';
import { Principal } from './Principal';
import { IdentityID } from './IdentityID';
import { SaplingPaymentAddress } from './SaplingPaymentAddress';
import { TxDestination } from './TxDestination';
import { ContentMultiMap } from './ContentMultiMap';
export declare const IDENTITY_VERSION_PBAAS: import("bn.js");
export declare const IDENITTY_VERSION_INVALID: import("bn.js");
export declare const IDENTITY_FLAG_REVOKED: import("bn.js");
export declare const IDENTITY_FLAG_ACTIVECURRENCY: import("bn.js");
export declare const IDENTITY_FLAG_LOCKED: import("bn.js");
export declare const IDENTITY_FLAG_TOKENIZED_CONTROL: import("bn.js");
export declare const IDENTITY_MAX_UNLOCK_DELAY: import("bn.js");
export declare const IDENTITY_MAX_NAME_LEN: import("bn.js");
export declare type Hashes = Map<string, Buffer>;
export declare type KvContent = Map<string, Array<Buffer>>;
export declare type VerusCLIVerusIDJson = {
    contentmap?: {
        [key: string]: string;
    };
    contentmultimap?: {
        [key: string]: Array<{
            [key: string]: string;
        } | string>;
    };
    flags: number;
    identityaddress: string;
    minimumsignatures: number;
    name: string;
    parent: string;
    primaryaddresses: Array<string>;
    privateaddress?: string;
    recoveryauthority: string;
    revocationauthority: string;
    systemid: string;
    timelock: number;
    version: number;
};
export declare class Identity extends Principal {
    parent: IdentityID;
    system_id: IdentityID;
    name: string;
    content_map: Hashes;
    content_multimap: ContentMultiMap;
    revocation_authority: IdentityID;
    recovery_authority: IdentityID;
    private_addresses: Array<SaplingPaymentAddress>;
    unlock_after: BigNumber;
    constructor(data?: {
        version?: BigNumber;
        flags?: BigNumber;
        min_sigs?: BigNumber;
        primary_addresses?: Array<TxDestination>;
        parent?: IdentityID;
        system_id?: IdentityID;
        name?: string;
        content_map?: Hashes;
        content_multimap?: ContentMultiMap;
        revocation_authority?: IdentityID;
        recovery_authority?: IdentityID;
        private_addresses?: Array<SaplingPaymentAddress>;
        unlock_after?: BigNumber;
    });
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number, multimapKeylists?: Array<Array<string> | null>): number;
    toJson(): VerusCLIVerusIDJson;
}
