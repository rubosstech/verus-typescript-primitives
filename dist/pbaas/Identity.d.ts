/// <reference types="node" />
import { BigNumber } from '../utils/types/BigNumber';
import { Principal } from './Principal';
export declare class Identity extends Principal {
    parent: string;
    system_id: string;
    name: string;
    contentmap: Map<string, Buffer>;
    contentmultimap: Map<string, Array<Buffer>>;
    revocation_authority: string;
    recovery_authority: string;
    private_addresses: Array<{
        d: Buffer;
        pk_d: Buffer;
    }>;
    timelock: number;
    constructor(data?: {
        version?: BigNumber | number;
        flags?: BigNumber | number;
        primaryaddresses?: Array<string>;
        minimumsignatures?: BigNumber | number;
        parent?: string;
        systemid?: string;
        name?: string;
        contentmap?: Map<string, Buffer>;
        contentmultimap?: Map<string, Array<Buffer>> | {
            [name: string]: Array<{
                [name: string]: string;
            }>;
        };
        revocationauthority?: string;
        recoveryauthority?: string;
        private_addresses?: Array<{
            d: Buffer;
            pk_d: Buffer;
        }> | [];
        timelock?: number;
        identityaddress?: string;
    });
    dataByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: any, offset?: number): number;
}
