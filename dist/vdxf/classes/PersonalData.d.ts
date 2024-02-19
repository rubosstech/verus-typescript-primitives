/// <reference types="node" />
import { VDXFObject } from "..";
import { AttestationDataType } from './attestationData';
export declare class PersonalData extends VDXFObject {
    type: PersonalData.TYPE;
    id: string;
    data: {
        [category: string]: Array<AttestationDataType>;
    };
    linkedAttestation: string;
    constructor(data?: {
        type?: PersonalData.TYPE;
        id?: string;
        data?: {
            [category: string]: Array<AttestationDataType>;
        };
        linkedAttestation?: string;
    }, vdxfkey?: string);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        type: PersonalData.TYPE;
        id: string;
        data: {
            [category: string]: AttestationDataType[];
        };
        linkedAttestation: string;
    };
}
export declare namespace PersonalData {
    enum TYPE {
        REQUEST = 1,
        SUBMITTED = 2,
        DESIGNATED = 3
    }
}
