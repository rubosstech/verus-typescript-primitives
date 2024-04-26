/// <reference types="node" />
import { BigNumber } from '../utils/types/BigNumber';
import { SerializableEntity } from '../utils/types/SerializableEntity';
export declare class Rating implements SerializableEntity {
    version: BigNumber;
    trustLevel: BigNumber;
    ratings: Map<string, Buffer>;
    constructor(data?: {
        version?: BigNumber;
        trustLevel?: BigNumber;
        ratings?: Map<string, Buffer>;
    });
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
}
