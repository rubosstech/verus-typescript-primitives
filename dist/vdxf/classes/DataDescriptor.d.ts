/// <reference types="bn.js" />
/// <reference types="node" />
import { BigNumber } from '../../utils/types/BigNumber';
import { BufferDataVdxfObject } from '../index';
import { VDXFKeyInterface } from "../keys";
export declare class DataDescriptor {
    static VERSION_INVALID: import("bn.js");
    static VERSION_FIRST: import("bn.js");
    static FIRST_VERSION: import("bn.js");
    static LAST_VERSION: import("bn.js");
    static DEFAULT_VERSION: import("bn.js");
    static FLAG_ENCRYPTED_DATA: import("bn.js");
    static FLAG_SALT_PRESENT: import("bn.js");
    static FLAG_ENCRYPTION_PUBLIC_KEY_PRESENT: import("bn.js");
    static FLAG_INCOMING_VIEWING_KEY_PRESENT: import("bn.js");
    static FLAG_SYMMETRIC_ENCRYPTION_KEY_PRESENT: import("bn.js");
    static FLAG_LABEL_PRESENT: import("bn.js");
    static FLAG_MIME_TYPE_PRESENT: import("bn.js");
    static FLAG_MASK: import("bn.js");
    version: BigNumber;
    flags: BigNumber;
    objectdata: Buffer;
    label: string;
    mimeType: string;
    salt: Buffer;
    epk: Buffer;
    ivk: Buffer;
    ssk: Buffer;
    constructor(data?: {
        version?: BigNumber;
        flags?: BigNumber;
        objectdata?: Buffer;
        label?: string;
        mimeType?: string;
        salt?: Buffer;
        epk?: Buffer;
        ivk?: Buffer;
        ssk?: Buffer;
    });
    static fromJson(data: any): DataDescriptor;
    DecodeHashVector(): Array<Buffer>;
    byteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    HasEncryptedData(): boolean;
    HasSalt(): boolean;
    HasEPK(): boolean;
    HasMIME(): boolean;
    HasIVK(): boolean;
    HasSSK(): boolean;
    HasLabel(): boolean;
    CalcFlags(): BigNumber;
    SetFlags(): void;
    IsValid(): boolean;
}
export declare class VDXF_Data extends BufferDataVdxfObject {
    static DataByteKeyName(): string;
    static DataByteKey(): VDXFKeyInterface;
    static DataInt16KeyName(): string;
    static DataInt16Key(): VDXFKeyInterface;
    static DataUint16KeyName(): string;
    static DataUint16Key(): VDXFKeyInterface;
    static DataInt32KeyName(): string;
    static DataInt32Key(): VDXFKeyInterface;
    static DataUint32KeyName(): string;
    static DataUint32Key(): VDXFKeyInterface;
    static DataInt64KeyName(): string;
    static DataInt64Key(): VDXFKeyInterface;
    static DataUint64KeyName(): string;
    static DataUint64Key(): VDXFKeyInterface;
    static DataUint160KeyName(): string;
    static DataUint160Key(): VDXFKeyInterface;
    static DataUint256KeyName(): string;
    static DataUint256Key(): VDXFKeyInterface;
    static DataStringKeyName(): string;
    static DataStringKey(): VDXFKeyInterface;
    static DataVectorKeyName(): string;
    static DataVectorKey(): VDXFKeyInterface;
    static DataByteVectorKeyName(): string;
    static DataByteVectorKey(): VDXFKeyInterface;
    static DataInt32VectorKeyName(): string;
    static DataInt32VectorKey(): VDXFKeyInterface;
    static DataInt64VectorKeyName(): string;
    static DataInt64VectorKey(): VDXFKeyInterface;
    static DataCurrencyMapKeyName(): string;
    static DataCurrencyMapKey(): VDXFKeyInterface;
    static DataRatingsKeyName(): string;
    static DataRatingsKey(): VDXFKeyInterface;
    static DataURLKeyName(): string;
    static DataURLKey(): VDXFKeyInterface;
    static DataTransferDestinationKeyName(): string;
    static DataTransferDestinationKey(): VDXFKeyInterface;
    static UTXORefKeyName(): string;
    static UTXORefKey(): VDXFKeyInterface;
    static CrossChainDataRefKeyName(): string;
    static CrossChainDataRefKey(): VDXFKeyInterface;
    static EncryptionDescriptorKeyName(): string;
    static EncryptionDescriptorKey(): VDXFKeyInterface;
    static SaltedDataKeyName(): string;
    static SaltedDataKey(): VDXFKeyInterface;
    static DataDescriptorKeyName(): string;
    static DataDescriptorKey(): VDXFKeyInterface;
    static SignatureDataKeyName(): string;
    static SignatureDataKey(): VDXFKeyInterface;
    static VectorUint256KeyName(): string;
    static VectorUint256Key(): VDXFKeyInterface;
    static MMRLinksKeyName(): string;
    static MMRLinksKey(): VDXFKeyInterface;
    static MMRDescriptorKeyName(): string;
    static MMRDescriptorKey(): VDXFKeyInterface;
    static TypeDefinitionKeyName(): string;
    static TypeDefinitionKey(): VDXFKeyInterface;
    static MultiMapKeyName(): string;
    static MultiMapKey(): VDXFKeyInterface;
    static ContentMultiMapRemoveKeyName(): string;
    static ContentMultiMapRemoveKey(): VDXFKeyInterface;
    static ProfileMediaKeyName(): string;
    static ProfileMediaKey(): VDXFKeyInterface;
    static ZMemoMessageKeyName(): string;
    static ZMemoMessageKey(): VDXFKeyInterface;
    static ZMemoSignatureKeyName(): string;
    static ZMemoSignatureKey(): VDXFKeyInterface;
    static CurrencyStartNotarizationKeyName(): string;
    static CurrencyStartNotarizationKey(): VDXFKeyInterface;
    GetHash(): void;
}
export declare class VDXFDataDescriptor extends BufferDataVdxfObject {
    dataDescriptor: DataDescriptor;
    constructor(dataDescriptor?: DataDescriptor, vdxfkey?: string, version?: BigNumber);
    static fromDataVdfxObject(data: BufferDataVdxfObject): VDXFDataDescriptor;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    HasEncryptedData(): boolean;
    HasLabel(): boolean;
    HasSalt(): boolean;
    HasEPK(): boolean;
    HasIVK(): boolean;
    HasSSK(): boolean;
    CalcFlags(): BigNumber;
    SetFlags(): void;
}
export declare enum EHashTypes {
    HASH_INVALID = 0,
    HASH_BLAKE2BMMR = 1,
    HASH_BLAKE2BMMR2 = 2,
    HASH_KECCAK = 3,
    HASH_SHA256D = 4,
    HASH_SHA256 = 5,
    HASH_LASTTYPE = 5
}
export declare class MMRDescriptor {
    static VERSION_INVALID: import("bn.js");
    static FIRST_VERSION: import("bn.js");
    static LAST_VERSION: import("bn.js");
    static DEFAULT_VERSION: import("bn.js");
    version: BigNumber;
    objectHashType: EHashTypes;
    mmrHashType: EHashTypes;
    mmrRoot: DataDescriptor;
    mmrHashes: DataDescriptor;
    dataDescriptors: DataDescriptor[];
    constructor(data?: {
        version?: BigNumber;
        objectHashType?: EHashTypes;
        mmrHashType?: EHashTypes;
        mmrRoot?: DataDescriptor;
        mmrHashes?: DataDescriptor;
        dataDescriptors?: DataDescriptor[];
    });
    static fromJson(data: any): MMRDescriptor;
    byteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    HasData(): boolean;
    IsValid(): boolean;
}
export declare const VectorEncodeVDXFUni: (obj: any) => Buffer;
