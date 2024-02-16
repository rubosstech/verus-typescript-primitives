/// <reference types="node" />
import { Utf8DataVdxfObject, HexDataVdxfObject, BufferDataVdxfObject, PNGImageVdxfObject, VDXFObject } from "..";
export declare const enum AttestationClassTypes {
    BUFFER_DATA_STRING = 1,
    BUFFER_DATA_BYTES = 2,
    BUFFER_DATA_BASE64 = 3,
    URL = 4,
    PNG_IMAGE = 5,
    KEY_ONLY = 6,
    BOOLEAN = 7
}
export declare const AttestationVdxfidMap: {
    [x: string]: {
        name: string;
        type: AttestationClassTypes;
    };
};
export declare class AttestationDataType {
    dataItem: Utf8DataVdxfObject | HexDataVdxfObject | BufferDataVdxfObject | PNGImageVdxfObject | VDXFObject;
    salt: Buffer;
    constructor(data: any, vdxfkey: string, salt?: string);
    dataBytelength(): number;
    toBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number, vdxfkey?: string): number;
}
export declare const friendlyNames: (vdfxkey: any) => string;
export declare class AttestationData {
    components: Map<number, AttestationDataType>;
    constructor(components?: Map<number, AttestationDataType>);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    size(): number;
    setDataFromJson(data: Array<AttestationDataType>, getSalt: Function): void;
    getHash(key: any): Buffer;
}
