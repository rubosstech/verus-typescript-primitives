/// <reference types="node" />
import { IdentityID } from './IdentityID';
import { KeyID } from './KeyID';
import { NoDestination } from './NoDestination';
export interface TxDestinationInterface {
    new (hash?: Buffer): TxDestination;
}
export declare type TxDestination = IdentityID | KeyID | NoDestination;
