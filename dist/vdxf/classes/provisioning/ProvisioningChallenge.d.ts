/// <reference types="node" />
import { Challenge } from "../Challenge";
import { Context } from "../Context";
export interface ProvisioningChallengeInterface {
    challenge_id: string;
    created_at: number;
    salt?: string;
    name?: string;
    context?: Context;
}
export declare class ProvisioningChallenge extends Challenge {
    name?: string;
    constructor(challenge?: ProvisioningChallengeInterface);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
}
