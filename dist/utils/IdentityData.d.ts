import * as keylist from '../vdxf/keys';
export declare const friendlyName: (vdxfkey: any) => string;
export declare const getIdentityDataType: (vdxfkey: any) => string | keylist.VDXFKeyInterface;
export declare const IdentityVdxfidMap: {
    [x: string]: {
        name: string;
        type: keylist.VDXFKeyInterface;
    } | {
        name: string;
        type: string;
    };
};
