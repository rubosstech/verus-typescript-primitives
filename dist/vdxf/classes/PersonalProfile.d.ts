/// <reference types="node" />
import { VDXFObject } from "..";
export declare class DataCategory {
    data: Array<VDXFObject>;
    category: string;
    vdxfid: string;
    constructor(data: Array<VDXFObject> | Array<{
        vdxfid: string;
    }>, category: string, vdxfid: string);
}
export declare class PersonalProfileDataStore extends VDXFObject {
    data: {
        [key: string]: DataCategory;
    };
    constructor(data?: Array<DataCategory>);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        data: {
            [key: string]: DataCategory;
        };
    };
}
