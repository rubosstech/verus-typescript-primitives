"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorEncodeVDXFUni = exports.MMRDescriptor = exports.EHashTypes = exports.CVDXFDataDescriptor = exports.VDXF_Data = exports.DataDescriptor = void 0;
const bn_js_1 = require("bn.js");
const index_1 = require("../index");
const varint_1 = require("../../utils/varint");
const varuint_1 = require("../../utils/varuint");
const bufferutils_1 = require("../../utils/bufferutils");
const { BufferReader, BufferWriter } = bufferutils_1.default;
const string_1 = require("../../utils/string");
const address_1 = require("../../utils/address");
const CurrencyValueMap_1 = require("../../pbaas/CurrencyValueMap");
const Rating_1 = require("../../pbaas/Rating");
const TransferDestination_1 = require("../../pbaas/TransferDestination");
const ContentMultiMapRemove_1 = require("../../pbaas/ContentMultiMapRemove");
const CrossChainDataRef_1 = require("./CrossChainDataRef");
const vdxf_1 = require("../../constants/vdxf");
const SignatureData_1 = require("./SignatureData");
class DataDescriptor {
    constructor(data) {
        this.flags = new bn_js_1.BN(0);
        this.version = DataDescriptor.DEFAULT_VERSION;
        if (data != null) {
            if (data.flags != null)
                this.flags = data.flags;
            if (data.version != null)
                this.version = data.version;
            if (data.objectdata != null)
                this.objectdata = data.objectdata;
            if (data.label != null)
                this.label = data.label;
            if (data.mimeType != null)
                this.mimeType = data.mimeType;
            if (data.salt != null)
                this.salt = data.salt;
            if (data.epk != null)
                this.epk = data.epk;
            if (data.ivk != null)
                this.ivk = data.ivk;
            if (data.ssk != null)
                this.ssk = data.ssk;
            if (this.label && this.label.length > 64) {
                this.label = this.label.slice(0, 64);
            }
            if (this.mimeType && this.mimeType.length > 128) {
                this.mimeType = this.mimeType.slice(0, 128);
            }
            this.SetFlags();
        }
    }
    static fromJson(data) {
        const newDataDescriptor = new DataDescriptor();
        if (data != null) {
            if (data.flags != null)
                newDataDescriptor.flags = new bn_js_1.BN(data.flags);
            if (data.version != null)
                newDataDescriptor.version = new bn_js_1.BN(data.version);
            if (data.objectdata != null)
                newDataDescriptor.objectdata = (0, exports.VectorEncodeVDXFUni)(data.objectdata);
            if (data.label != null)
                newDataDescriptor.label = data.label;
            if (data.mimetype != null)
                newDataDescriptor.mimeType = data.mimetype;
            if (data.salt != null)
                newDataDescriptor.salt = Buffer.from(data.salt, 'hex');
            if (data.epk != null)
                newDataDescriptor.epk = Buffer.from(data.epk, 'hex');
            if (data.ivk != null)
                newDataDescriptor.ivk = Buffer.from(data.ivk, 'hex');
            if (data.ssk != null)
                newDataDescriptor.ssk = Buffer.from(data.ssk, 'hex');
            if (newDataDescriptor.label && newDataDescriptor.label.length > 64) {
                newDataDescriptor.label = newDataDescriptor.label.slice(0, 64);
            }
            if (newDataDescriptor.mimeType && newDataDescriptor.mimeType.length > 128) {
                newDataDescriptor.mimeType = newDataDescriptor.mimeType.slice(0, 128);
            }
        }
        ;
        newDataDescriptor.SetFlags();
        return newDataDescriptor;
    }
    DecodeHashVector() {
        const vdxfData = new VDXF_Data("", "");
        vdxfData.fromBuffer(this.objectdata);
        const hashes = [];
        if (vdxfData.vdxfkey == VDXF_Data.VectorUint256Key().vdxfid) {
            const reader = new BufferReader(Buffer.from(vdxfData.data, 'hex'));
            const count = reader.readVarInt();
            for (let i = 0; i < count.toNumber(); i++) {
                hashes.push(reader.readSlice(32));
            }
        }
        return hashes;
    }
    byteLength() {
        let length = 0;
        length += varint_1.default.encodingLength(this.version);
        length += varint_1.default.encodingLength(this.flags);
        length += varuint_1.default.encodingLength(this.objectdata.length);
        length += this.objectdata.length;
        if (this.HasLabel()) {
            if (this.label.length > 64) {
                throw new Error("Label too long");
            }
            length += varuint_1.default.encodingLength(this.label.length);
            length += this.label.length;
        }
        if (this.HasMIME()) {
            if (this.mimeType.length > 128) {
                throw new Error("MIME type too long");
            }
            length += varuint_1.default.encodingLength(this.mimeType.length);
            length += this.mimeType.length;
        }
        if (this.HasSalt()) {
            length += varuint_1.default.encodingLength(this.salt.length);
            length += this.salt.length;
        }
        if (this.HasEPK()) {
            length += varuint_1.default.encodingLength(this.epk.length);
            length += this.epk.length;
        }
        if (this.HasIVK()) {
            length += varuint_1.default.encodingLength(this.ivk.length);
            length += this.ivk.length;
        }
        if (this.HasSSK()) {
            length += varuint_1.default.encodingLength(this.ssk.length);
            length += this.ssk.length;
        }
        return length;
    }
    toBuffer() {
        const writer = new BufferWriter(Buffer.alloc(this.byteLength()));
        writer.writeVarInt(this.version);
        writer.writeVarInt(this.flags);
        writer.writeVarSlice(this.objectdata);
        if (this.HasLabel()) {
            writer.writeVarSlice(Buffer.from(this.label));
        }
        if (this.HasMIME()) {
            writer.writeVarSlice(Buffer.from(this.mimeType));
        }
        if (this.HasSalt()) {
            writer.writeVarSlice(this.salt);
        }
        if (this.HasEPK()) {
            writer.writeVarSlice(this.epk);
        }
        if (this.HasIVK()) {
            writer.writeVarSlice(this.ivk);
        }
        if (this.HasSSK()) {
            writer.writeVarSlice(this.ssk);
        }
        return writer.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        this.version = reader.readVarInt();
        this.flags = reader.readVarInt();
        this.objectdata = reader.readVarSlice();
        if (this.HasLabel()) {
            this.label = reader.readVarSlice().toString();
        }
        if (this.HasMIME()) {
            this.mimeType = reader.readVarSlice().toString();
        }
        if (this.HasSalt()) {
            this.salt = reader.readVarSlice();
        }
        if (this.HasEPK()) {
            this.epk = reader.readVarSlice();
        }
        if (this.HasIVK()) {
            this.ivk = reader.readVarSlice();
        }
        if (this.HasSSK()) {
            this.ssk = reader.readVarSlice();
        }
        return reader.offset;
    }
    HasEncryptedData() {
        return this.flags.and(DataDescriptor.FLAG_ENCRYPTED_DATA).gt(new bn_js_1.BN(0));
    }
    HasSalt() {
        return this.flags.and(DataDescriptor.FLAG_SALT_PRESENT).gt(new bn_js_1.BN(0));
    }
    HasEPK() {
        return this.flags.and(DataDescriptor.FLAG_ENCRYPTION_PUBLIC_KEY_PRESENT).gt(new bn_js_1.BN(0));
    }
    HasMIME() {
        return this.flags.and(DataDescriptor.FLAG_MIME_TYPE_PRESENT).gt(new bn_js_1.BN(0));
    }
    HasIVK() {
        return this.flags.and(DataDescriptor.FLAG_INCOMING_VIEWING_KEY_PRESENT).gt(new bn_js_1.BN(0));
    }
    HasSSK() {
        return this.flags.and(DataDescriptor.FLAG_SYMMETRIC_ENCRYPTION_KEY_PRESENT).gt(new bn_js_1.BN(0));
    }
    HasLabel() {
        return this.flags.and(DataDescriptor.FLAG_LABEL_PRESENT).gt(new bn_js_1.BN(0));
    }
    CalcFlags() {
        return this.flags.and(DataDescriptor.FLAG_ENCRYPTED_DATA).add(this.label ? DataDescriptor.FLAG_LABEL_PRESENT : new bn_js_1.BN(0)).add(this.mimeType ? DataDescriptor.FLAG_MIME_TYPE_PRESENT : new bn_js_1.BN(0)).add(this.salt ? DataDescriptor.FLAG_SALT_PRESENT : new bn_js_1.BN(0)).add(this.epk ? DataDescriptor.FLAG_ENCRYPTION_PUBLIC_KEY_PRESENT : new bn_js_1.BN(0)).add(this.ivk ? DataDescriptor.FLAG_INCOMING_VIEWING_KEY_PRESENT : new bn_js_1.BN(0)).add(this.ssk ? DataDescriptor.FLAG_SYMMETRIC_ENCRYPTION_KEY_PRESENT : new bn_js_1.BN(0));
    }
    SetFlags() {
        this.flags = this.CalcFlags();
    }
    IsValid() {
        return this.version.gte(DataDescriptor.FIRST_VERSION) && this.version.lte(DataDescriptor.LAST_VERSION) && (this.flags.and(new bn_js_1.BN(~DataDescriptor.FLAG_MASK)).eq(new bn_js_1.BN(0)));
    }
}
exports.DataDescriptor = DataDescriptor;
DataDescriptor.VERSION_INVALID = new bn_js_1.BN(0);
DataDescriptor.VERSION_FIRST = new bn_js_1.BN(1);
DataDescriptor.FIRST_VERSION = new bn_js_1.BN(1);
DataDescriptor.LAST_VERSION = new bn_js_1.BN(1);
DataDescriptor.DEFAULT_VERSION = new bn_js_1.BN(1);
DataDescriptor.FLAG_ENCRYPTED_DATA = new bn_js_1.BN(1);
DataDescriptor.FLAG_SALT_PRESENT = new bn_js_1.BN(2);
DataDescriptor.FLAG_ENCRYPTION_PUBLIC_KEY_PRESENT = new bn_js_1.BN(4);
DataDescriptor.FLAG_INCOMING_VIEWING_KEY_PRESENT = new bn_js_1.BN(8);
DataDescriptor.FLAG_SYMMETRIC_ENCRYPTION_KEY_PRESENT = new bn_js_1.BN(0x10);
DataDescriptor.FLAG_LABEL_PRESENT = new bn_js_1.BN(0x20);
DataDescriptor.FLAG_MIME_TYPE_PRESENT = new bn_js_1.BN(0x40);
DataDescriptor.FLAG_MASK = (DataDescriptor.FLAG_ENCRYPTED_DATA.add(DataDescriptor.FLAG_SALT_PRESENT).add(DataDescriptor.FLAG_ENCRYPTION_PUBLIC_KEY_PRESENT).add(DataDescriptor.FLAG_INCOMING_VIEWING_KEY_PRESENT).add(DataDescriptor.FLAG_SYMMETRIC_ENCRYPTION_KEY_PRESENT).add(DataDescriptor.FLAG_LABEL_PRESENT).add(DataDescriptor.FLAG_MIME_TYPE_PRESENT));
;
// VDXF data that describes an encrypted chunk of data
class VDXF_Data extends index_1.BufferDataVdxfObject {
    constructor(data, key) {
        super(data, key);
    }
    static DataByteKeyName() {
        return "vrsc::data.type.byte";
    }
    static DataByteKey() {
        return {
            "vdxfid": "iBXUHbh4iacbeZnzDRxishvBSrYk2S2k7t",
            "indexid": "xGMakQ89ZtqGGjg257csr6SiUWZksGmjWp",
            "hash160result": "2e97a8bba443773812341e1d761530d3bba04f58",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.byte"
            }
        };
    }
    static DataInt16KeyName() {
        return "vrsc::data.type.int16";
    }
    static DataInt16Key() {
        return {
            "vdxfid": "iDtTv3wf1Vk3M2Y46RjLPKtttx5hydwtY1",
            "indexid": "xJiaNrNjroxhyCR5x7PVMiRRvc6ipg6N9g",
            "hash160result": "ee334ebd432db0b24cc2702eda61c28ff44d3872",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.int16"
            }
        };
    }
    static DataUint16KeyName() {
        return "vrsc::data.type.uint16";
    }
    static DataUint16Key() {
        return {
            "vdxfid": "iHn7urT2yVfS7pQn6WGAmCVWh4HBLV24n3",
            "indexid": "xNcENet7pot6jzHoxBvKjb23iiJCGpekDk",
            "hash160result": "5cfc322d2a216145f7b82714115e7953269de59c",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.uint16"
            }
        };
    }
    static DataInt32KeyName() {
        return "vrsc::data.type.int32";
    }
    static DataInt32Key() {
        return {
            "vdxfid": "iHpLPprRDv3H5H3ZMaJ9nyHFzkG9xJWZDb",
            "indexid": "xNeSrdHW5EFwhSvbDFxJmMoo2QHAtoEaEM",
            "hash160result": "3e9ba478b23b13232f28d21051d907ce8fdd509d",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.int32"
            }
        };
    }
    static DataUint32KeyName() {
        return "vrsc::data.type.uint32";
    }
    static DataUint32Key() {
        return {
            "vdxfid": "iKSj5zhd6cSsLudaGhtfmisRNgEM7SPFWY",
            "indexid": "xQGqYo8hwvfXy5Wc8PYpk7PxQLFMwfP7Fp",
            "hash160result": "f279818aeb4fe768956b350d1fc7216ca0e82aaf",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.uint32"
            }
        };
    }
    static DataInt64KeyName() {
        return "vrsc::data.type.int64";
    }
    static DataInt64Key() {
        return {
            "vdxfid": "iKB3TGi9Dg5HZ4nQAgLQAgp3tuXBaRKHpC",
            "indexid": "xQ19v59E4zHxBEfS2MzZ95LavZYCTTeuyg",
            "hash160result": "ab3705f8a7fae59786ef897b014df85fcd9533ac",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.int64"
            }
        };
    }
    static DataUint64KeyName() {
        return "vrsc::data.type.uint64";
    }
    static DataUint64Key() {
        return {
            "vdxfid": "iPamkQf38AeGQ8z4zSsZL7t9kXMeUkYLJL",
            "indexid": "xUQtDD67yUrw2Js6r8XiJWQgnBNfNeeoUq",
            "hash160result": "bb2ae9ed3e9f400def0724937fbf65f23ef690dc",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.uint64"
            }
        };
    }
    static DataUint160KeyName() {
        return "vrsc::data.type.uint160";
    }
    static DataUint160Key() {
        return {
            "vdxfid": "iAAwdbLyKYL39nJ1eQHaHtb75krg4mV1Lq",
            "indexid": "xF146Pn4ArYhmxB3W5wjGH7e7Qsgx9bkpj",
            "hash160result": "d97d2295d4c73f6f6f0697c8086bd822d6977549",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.uint160"
            }
        };
    }
    static DataUint256KeyName() {
        return "vrsc::data.type.uint256";
    }
    static DataUint256Key() {
        return {
            "vdxfid": "i8k7g7z6grtGYrNZmZr5TQ872aHssXuuua",
            "indexid": "xDaE8vRBYB6wB2FbdFWERnee4EJtjbCtMM",
            "hash160result": "939b27bea698d180237c40b2194025acc673cb39",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.uint256"
            }
        };
    }
    static DataStringKeyName() {
        return "vrsc::data.type.string";
    }
    static DataStringKey() {
        return {
            "vdxfid": "iK7a5JNJnbeuYWVHCDRpJosj3irGJ5Qa8c",
            "indexid": "xPwgY6oPdusaAgNK3u5yHCQG5NsHEcBpi5",
            "hash160result": "e5c061641228a399169211e666de18448b7b8bab",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.string"
            }
        };
    }
    // this is a key for a typed vector, which will have the object type key following the vector key
    static DataVectorKeyName() {
        return "vrsc::data.type.vector";
    }
    static DataVectorKey() {
        return {
            "vdxfid": "iAEShwk1xjdGhaUSz3Maa2XR32o3vRuHq7",
            "indexid": "xF4ZAkB6p3qwKkMUqj1jYR3x4gp4mGz657",
            "hash160result": "503875b0dc301189a98927d3ece56c5f921c1f4a",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.vector"
            }
        };
    }
    static DataByteVectorKeyName() {
        return "vrsc::data.type.bytevector";
    }
    static DataByteVectorKey() {
        return {
            "vdxfid": "iKMhRLX1JHQihVZx2t2pAWW2uzmK6AzwW3",
            "indexid": "xQBot8x69bdPKfSytZgy8u2ZwenKzVjR4X",
            "hash160result": "cc3ae6466006629f5105f71325bb2a19107037ae",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.bytevector"
            }
        };
    }
    static DataInt32VectorKeyName() {
        return "vrsc::data.type.int32vector";
    }
    static DataInt32VectorKey() {
        return {
            "vdxfid": "iJZt2fcUv1iivbfC3tuPuefabcTppQEoVq",
            "indexid": "xPPzVU3ZmKwPYmYDuaZYt3C7dGUqk939N7",
            "hash160result": "c0847f3025c408059b5a8f6a9e414a8ed8288da5",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.int32vector"
            }
        };
    }
    static DataInt64VectorKeyName() {
        return "vrsc::data.type.int64vector";
    }
    static DataInt64VectorKey() {
        return {
            "vdxfid": "i4qtYkFS9iNyu2AkqwoSn1xyCdfH9PUvak",
            "indexid": "x9g11YgX12beXC3nhdTbkQVWEHgJ2jqfz1",
            "hash160result": "c6219ea13884987453692cb14c72d5f6a47c020f",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.int64vector"
            }
        };
    }
    static DataCurrencyMapKeyName() {
        return "vrsc::data.type.object.currencymap";
    }
    static DataCurrencyMapKey() {
        return {
            "vdxfid": "iMrGhzkZq5fpWWSa1RambRySFPb7CuvKuX",
            "indexid": "xSgPAoBegPtV8gKbs7EvZpVyH3c858ZUvL",
            "hash160result": "25db70c2fcae2571f89201181bec04587e1f8fc9",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.object.currencymap"
            }
        };
    }
    static DataRatingsKeyName() {
        return "vrsc::data.type.object.ratings";
    }
    static DataRatingsKey() {
        return {
            "vdxfid": "iHJComZUXXGniLkDhjYprWYEN8qvQGDoam",
            "indexid": "xN8KGZzZNqVTLWdFZRCypu4mPnrwHFKbCK",
            "hash160result": "32cad57ff1dc5db4b5ba573ce01bc9c89b0d9e97",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.object.ratings"
            }
        };
    }
    static DataURLKeyName() {
        return "vrsc::data.type.object.url";
    }
    static DataURLKey() {
        return {
            "vdxfid": "iJ7xdhJTJAvJubNnSJFXyA3jujzqGxjLuZ",
            "indexid": "xNx56VjY9V8yXmFpHyugwYaGwQ1rCt6J9W",
            "hash160result": "7748bfaf53dd2ff63ed5f73a41174c360f30a6a0",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.object.url"
            }
        };
    }
    static DataTransferDestinationKeyName() {
        return "vrsc::data.type.object.transferdestination";
    }
    static DataTransferDestinationKey() {
        return {
            "vdxfid": "i91L6zwZQrkbNVMB1AZ1Z671qybexRmeVK",
            "indexid": "xDqSZoNeGAyFzfECrrDAXUdYsdcfs3Zuku",
            "hash160result": "92f38773849383146037b16a48ea350c1c11ac3c",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.object.transferdestination"
            }
        };
    }
    static UTXORefKeyName() {
        return "vrsc::data.type.object.utxoref";
    }
    static UTXORefKey() {
        return {
            "vdxfid": "iNcKvh7mazaXptzHf85q6EtpFYFE7asKC1",
            "indexid": "xTSSPVYrSJoCT4sKWojz4dRMHCGF3h9tM4",
            "hash160result": "013e760f7451c289672993ea391ae643c21ce4d1",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.object.utxoref"
            }
        };
    }
    static CrossChainDataRefKeyName() {
        return "vrsc::data.type.object.crosschaindataref";
    }
    static CrossChainDataRefKey() {
        return {
            "vdxfid": "iP3euVSzNcXUrLNHnQnR9G6q8jeYuGSxgw",
            "indexid": "xTsmNHt5Dvk9UWFKe6Sa7edNAPfZmJVgLc",
            "hash160result": "4d33e0aee0f648c7871b2661d1221b57c05aaed6",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.object.crosschaindataref"
            }
        };
    }
    static EncryptionDescriptorKeyName() {
        return "vrsc::data.type.encryptiondescriptor";
    }
    static EncryptionDescriptorKey() {
        return {
            "vdxfid": "iHEEK8ipj58BeKZNWuaaR2tDR5RK2kmf9A",
            "indexid": "xN4Lmw9uaPLrGVSQNbEjPRQkSjSKxsHUQu",
            "hash160result": "8d021acc1b68335bd7d37b28ff773c138ea5dd96",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.encryptiondescriptor"
            }
        };
    }
    static SaltedDataKeyName() {
        return "vrsc::data.type.salteddata";
    }
    static SaltedDataKey() {
        return {
            "vdxfid": "i92U1nLuLJkC44FZZ4Lq9zk4qW3HrWAWNo",
            "indexid": "xDraUamzBcxrgE8bQjzz8PGbsA4JiFskTD",
            "hash160result": "9e13510e01d0d03a7bc90d7a2ef32824f515e33c",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.salteddata"
            }
        };
    }
    static DataDescriptorKeyName() {
        return "vrsc::data.type.object.datadescriptor";
    }
    static DataDescriptorKey() {
        return {
            "vdxfid": "i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv",
            "indexid": "x96JULhKLXEgCqPwUxTQGtAKhPK6Qh1iaW",
            "hash160result": "4d4f12424ded2033a526a4e2a8835fc5b2eba208",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.object.datadescriptor"
            }
        };
    }
    static SignatureDataKeyName() {
        return "vrsc::data.signaturedata";
    }
    static SignatureDataKey() {
        return {
            "vdxfid": "i7PcVF9wwPtQ6p6jDtCVpohX65pTZuP2ah",
            "indexid": "xCDix3b2ni74iyym5ZreoCE47jqUTBFRAb",
            "hash160result": "b48b359e9a00042cec64f7f66ac717d388a4f22a",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.signaturedata"
            }
        };
    }
    static VectorUint256KeyName() {
        return "vrsc::data.mmrhashes";
    }
    static VectorUint256Key() {
        return {
            "vdxfid": "i9UgJ2WxGw95PKdoCXjpfnBShtP5gi9fxS",
            "indexid": "xEJnkpx38FMk1VWq4DPyeAhyjYQ6X5Gsti",
            "hash160result": "8c1afd59e904f6d2702699963abccbc6d326d841",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.mmrhashes"
            }
        };
    }
    static MMRLinksKeyName() {
        return "vrsc::data.mmrlinks";
    }
    static MMRLinksKey() {
        return {
            "vdxfid": "iPQsnA1R8UjHNddZKZ3FxsuKQ5WzKqSC7w",
            "indexid": "xUEzExSVynwwzoWbBEhQwGRrRjY1Bc2MYc",
            "hash160result": "f535a4e9ac0f94eda01695d16489a4a102d6b1da",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.mmrlinks"
            }
        };
    }
    static MMRDescriptorKeyName() {
        return "vrsc::data.mmrdescriptor";
    }
    static MMRDescriptorKey() {
        return {
            "vdxfid": "i9dVDb4LgfMYrZD1JBNP2uaso4bNAkT4Jr",
            "indexid": "xETbgPVRXyaDUj639s2Y1J7QpicP4DvZMt",
            "hash160result": "97273a4c02d6be002f8d69c3979616732ba68243",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.mmrdescriptor"
            }
        };
    }
    static TypeDefinitionKeyName() {
        return "vrsc::data.type.typedefinition";
    }
    static TypeDefinitionKey() {
        return {
            "vdxfid": "iL5MPPHWXQEY3p2Q1UsmGDvXsgPiqd1W1S",
            "indexid": "xQuTrBibNiTCfyuRsAXvEcT4uLQjhxrpyL",
            "hash160result": "ae8d805d9650c0512a6b6ec33e963386542f18b6",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::data.type.typedefinition"
            }
        };
    }
    static MultiMapKeyName() {
        return "vrsc::identity.multimapkey";
    }
    static MultiMapKey() {
        return {
            "vdxfid": "i3mbggp3NBR77C5JeFQJTpAxmgMidayLLE",
            "indexid": "x8bi9VF8DVdmjMxLVw4TSChVoLNjUyapgs",
            "hash160result": "6920bb81b420bc95e29a10ed677379b1e39e3a03",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::identity.multimapkey"
            }
        };
    }
    static ContentMultiMapRemoveKeyName() {
        return "vrsc::identity.multimapremove";
    }
    static ContentMultiMapRemoveKey() {
        return {
            "vdxfid": "i5Zkx5Z7tEfh42xtKfwbJ5LgEWE9rEgpFY",
            "indexid": "xAPsQszCjYtMgCqvBMbkGTsDGAFAmrN33A",
            "hash160result": "d393b986e4f82db7bec82d97b186882d739ded16",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::identity.multimapremove"
            }
        };
    }
    // for any ID, this key indexes content that applies to representing the profile of
    // that ID. there may be many mime-type instances of a particular piece of profile media
    static ProfileMediaKeyName() {
        return "vrsc::identity.profile.media";
    }
    static ProfileMediaKey() {
        return {
            "vdxfid": "iEYsp2njSt1M4EVYi9uuAPBU2wpKmThkkr",
            "indexid": "xKNzGqDpJCE1gQNaZqa48mi14bqLaG669g",
            "hash160result": "e95b2ee1abb130a93900ddaef2d8e528010f7c79",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::identity.profile.media"
            }
        };
    }
    static ZMemoMessageKeyName() {
        return "vrsc::system.zmemo.message";
    }
    static ZMemoMessageKey() {
        return {
            "vdxfid": "iNHg1n828PUxktkYeNxC6sdVmuKTipn3L3",
            "indexid": "xT7nUaZ6yhhdP4daW4cM5GA2oZLUaNVaBD",
            "hash160result": "4a8f418203621f10d1a61701be8dbbbb38fa5cce",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::system.zmemo.message"
            }
        };
    }
    static ZMemoSignatureKeyName() {
        return "vrsc::system.zmemo.signature";
    }
    static ZMemoSignatureKey() {
        return {
            "vdxfid": "i7mrLLjUfGYuHJwnsxFvd282hsdn4staJG",
            "indexid": "xCbxo9AZWamZuUppjdv5bQeZjXeo1vbaCc",
            "hash160result": "7b47c8cd90c4c3ddc542f37ca77473b7325a272f",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::system.zmemo.signature"
            }
        };
    }
    static CurrencyStartNotarizationKeyName() {
        return "vrsc::system.currency.startnotarization";
    }
    static CurrencyStartNotarizationKey() {
        return {
            "vdxfid": "iRvxVcGLaCXcDiAfnQ5FfeBCo2AiBibAft",
            "indexid": "xWm4xQhRRWkGqt3he5jQe2hjpgBj5C7Tj3",
            "hash160result": "b537201ca6465976bea7bdb03119644a858052f6",
            "qualifiedname": {
                "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
                "name": "vrsc::system.currency.startnotarization"
            }
        };
    }
    GetHash() { }
    ;
}
exports.VDXF_Data = VDXF_Data;
;
class CVDXFDataDescriptor extends index_1.BufferDataVdxfObject {
    constructor(vdxfData) {
        super(vdxfData.data, vdxfData.vdxfkey);
        this.version = vdxfData.version;
        if (this.data != null) {
            this.dataDescriptor = new DataDescriptor();
            this.dataDescriptor.fromBuffer(Buffer.from(this.data, 'hex'));
            delete this.data;
        }
    }
    dataByteLength() {
        let length = 0;
        length += this.dataDescriptor.byteLength();
        return length;
    }
    toDataBuffer() {
        return this.dataDescriptor.toBuffer();
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        this.data = reader.readVarSlice().toString('hex');
        this.dataDescriptor = new DataDescriptor();
        this.dataDescriptor.fromBuffer(Buffer.from(this.data, 'hex'));
        delete this.data;
        return reader.offset;
    }
    HasEncryptedData() {
        return this.dataDescriptor.HasEncryptedData();
    }
    HasLabel() {
        return this.dataDescriptor.HasLabel();
    }
    HasSalt() {
        return this.dataDescriptor.HasSalt();
    }
    HasEPK() {
        return this.dataDescriptor.HasEPK();
    }
    HasIVK() {
        return this.dataDescriptor.HasIVK();
    }
    HasSSK() {
        return this.dataDescriptor.HasSSK();
    }
    CalcFlags() {
        return this.dataDescriptor.CalcFlags();
    }
    SetFlags() {
        return this.dataDescriptor.SetFlags();
    }
}
exports.CVDXFDataDescriptor = CVDXFDataDescriptor;
;
var EHashTypes;
(function (EHashTypes) {
    EHashTypes[EHashTypes["HASH_INVALID"] = 0] = "HASH_INVALID";
    EHashTypes[EHashTypes["HASH_BLAKE2BMMR"] = 1] = "HASH_BLAKE2BMMR";
    EHashTypes[EHashTypes["HASH_BLAKE2BMMR2"] = 2] = "HASH_BLAKE2BMMR2";
    EHashTypes[EHashTypes["HASH_KECCAK"] = 3] = "HASH_KECCAK";
    EHashTypes[EHashTypes["HASH_SHA256D"] = 4] = "HASH_SHA256D";
    EHashTypes[EHashTypes["HASH_SHA256"] = 5] = "HASH_SHA256";
    EHashTypes[EHashTypes["HASH_LASTTYPE"] = 5] = "HASH_LASTTYPE";
})(EHashTypes = exports.EHashTypes || (exports.EHashTypes = {}));
;
class MMRDescriptor {
    constructor(data) {
        if (data) {
            if (data.version)
                this.version = data.version;
            if (data.objectHashType)
                this.objectHashType = data.objectHashType;
            if (data.mmrHashType)
                this.mmrHashType = data.mmrHashType;
            if (data.mmrRoot)
                this.mmrRoot = data.mmrRoot;
            if (data.mmrHashes)
                this.mmrHashes = data.mmrHashes;
            if (data.dataDescriptors)
                this.dataDescriptors = data.dataDescriptors;
        }
        else {
            this.version = MMRDescriptor.DEFAULT_VERSION;
        }
    }
    static fromJson(data) {
        const newMMRDescriptor = new MMRDescriptor();
        if (data) {
            if (data.version)
                newMMRDescriptor.version = new bn_js_1.BN(data.version);
            if (data.objecthashtype)
                newMMRDescriptor.objectHashType = data.objecthashtype;
            if (data.mmrhashtype)
                newMMRDescriptor.mmrHashType = data.mmrhashtype;
            if (data.mmrroot)
                newMMRDescriptor.mmrRoot = DataDescriptor.fromJson(data.mmrroot);
            if (data.mmrhashes)
                newMMRDescriptor.mmrHashes = DataDescriptor.fromJson(data.mmrhashes);
            if (data.datadescriptors) {
                newMMRDescriptor.dataDescriptors = [];
                data.datadescriptors.forEach((data) => {
                    newMMRDescriptor.dataDescriptors.push(DataDescriptor.fromJson(data));
                });
            }
            ;
        }
        return newMMRDescriptor;
    }
    byteLength() {
        let length = 0;
        length += varint_1.default.encodingLength(this.version);
        length += varint_1.default.encodingLength(new bn_js_1.BN(this.objectHashType));
        length += varint_1.default.encodingLength(new bn_js_1.BN(this.mmrHashType));
        length += this.mmrRoot.byteLength();
        length += this.mmrHashes.byteLength();
        length += varuint_1.default.encodingLength(this.dataDescriptors.length);
        this.dataDescriptors.forEach((dataDescriptor) => {
            length += dataDescriptor.byteLength();
        });
        return length;
    }
    toBuffer() {
        const writer = new BufferWriter(Buffer.alloc(this.byteLength()));
        writer.writeVarInt(this.version);
        writer.writeVarInt(new bn_js_1.BN(this.objectHashType));
        writer.writeVarInt(new bn_js_1.BN(this.mmrHashType));
        writer.writeSlice(this.mmrRoot.toBuffer());
        writer.writeSlice(this.mmrHashes.toBuffer());
        writer.writeCompactSize(this.dataDescriptors.length);
        this.dataDescriptors.forEach((dataDescriptor) => {
            writer.writeSlice(dataDescriptor.toBuffer());
        });
        return writer.buffer;
    }
    fromBuffer(buffer, offset) {
        const reader = new BufferReader(buffer, offset);
        this.version = reader.readVarInt();
        this.objectHashType = reader.readVarInt().toNumber();
        this.mmrHashType = reader.readVarInt().toNumber();
        this.mmrRoot = new DataDescriptor();
        this.mmrRoot.fromBuffer(reader.readVarSlice());
        this.mmrHashes = new DataDescriptor();
        this.mmrHashes.fromBuffer(reader.readVarSlice());
        const dataDescriptorsLength = reader.readCompactSize();
        this.dataDescriptors = [];
        for (let i = 0; i < dataDescriptorsLength; i++) {
            const dataDescriptor = new DataDescriptor();
            dataDescriptor.fromBuffer(reader.readVarSlice());
            this.dataDescriptors.push(dataDescriptor);
        }
        return reader.offset;
    }
    HasData() {
        return !!(this.mmrHashes.objectdata && this.dataDescriptors);
    }
    IsValid() {
        return this.version >= MMRDescriptor.FIRST_VERSION && this.version <= MMRDescriptor.LAST_VERSION;
    }
}
exports.MMRDescriptor = MMRDescriptor;
MMRDescriptor.VERSION_INVALID = new bn_js_1.BN(0);
MMRDescriptor.FIRST_VERSION = new bn_js_1.BN(1);
MMRDescriptor.LAST_VERSION = new bn_js_1.BN(1);
MMRDescriptor.DEFAULT_VERSION = new bn_js_1.BN(1);
;
const VectorEncodeVDXFUni = (obj) => {
    let ss = Buffer.from('');
    if (typeof (obj) != 'object') {
        if (typeof (obj) != 'string')
            throw new Error('VectorEncodeVDXFUni: not JSON string as expected');
        if ((0, string_1.isHexString)(obj)) {
            return Buffer.from(obj, "hex");
        }
        return Buffer.from(obj, "utf-8");
    }
    if (obj.serializedHex) {
        if (!(0, string_1.isHexString)(obj.serializedHex)) {
            throw new Error("contentmap: If the \"serializedhex\" key is present, it's data must be only valid hex and complete");
        }
        return Buffer.from(obj.serializedHex);
    }
    if (obj.serializedBase64) {
        try {
            return Buffer.from(obj.serializedBase64, 'base64');
        }
        catch (e) {
            throw new Error("contentmap: If the \"serializedBase64\" key is present, it's data must be only valid base64 and complete");
        }
    }
    if (obj.message) {
        return Buffer.from(obj.message, "utf-8");
    }
    // this should be an object with "vdxfkey" as the key and {object} as the json object to serialize
    const oneValKeys = Object.keys(obj);
    const oneValValues = Object.values(obj);
    for (let k = 0; k < oneValKeys.length; k++) {
        const objTypeKey = oneValKeys[k];
        if (objTypeKey == VDXF_Data.DataByteKey().vdxfid) {
            const oneByte = Buffer.from(oneValValues[k], "hex");
            if (oneByte.length != 1) {
                throw new Error("contentmap: byte data must be exactly one byte");
            }
            ss = Buffer.concat([ss, oneByte]);
        }
        else if (objTypeKey == VDXF_Data.DataInt16Key().vdxfid) {
            const oneShort = Buffer.alloc(2);
            oneShort.writeInt16LE(oneValValues[k]);
            ss = Buffer.concat([ss, oneShort]);
        }
        else if (objTypeKey == VDXF_Data.DataUint16Key().vdxfid) {
            const oneUShort = Buffer.alloc(2);
            oneUShort.writeUInt16LE(oneValValues[k]);
            ss = Buffer.concat([ss, oneUShort]);
        }
        else if (objTypeKey == VDXF_Data.DataInt32Key().vdxfid) {
            const oneInt = Buffer.alloc(4);
            oneInt.writeInt32LE(oneValValues[k]);
            ss = Buffer.concat([ss, oneInt]);
        }
        else if (objTypeKey == VDXF_Data.DataUint32Key().vdxfid) {
            const oneUInt = Buffer.alloc(4);
            oneUInt.writeUInt32LE(oneValValues[k]);
            ss = Buffer.concat([ss, oneUInt]);
        }
        else if (objTypeKey == VDXF_Data.DataInt64Key().vdxfid) {
            const oneInt64 = Buffer.alloc(8);
            oneInt64.writeIntLE(oneValValues[k], 0, 8);
            ss = Buffer.concat([ss, oneInt64]);
        }
        else if (objTypeKey == VDXF_Data.DataUint160Key().vdxfid) {
            const oneKey = (0, address_1.fromBase58Check)(oneValValues[k]).hash;
            ss = Buffer.concat([ss, oneKey]);
        }
        else if (objTypeKey == VDXF_Data.DataUint256Key().vdxfid) {
            const oneHash = Buffer.from(oneValValues[k], "hex");
            if (oneHash.length != 32) {
                throw new Error("contentmap: hash data must be exactly 32 bytes");
            }
            ss = Buffer.concat([ss, oneHash.reverse()]);
        }
        else if (objTypeKey == VDXF_Data.DataStringKey().vdxfid) {
            let length = 20;
            length += 1;
            const encodedLength = varuint_1.default.encodingLength(Buffer.from(oneValValues[k], "utf-8").length);
            length += varuint_1.default.encodingLength(encodedLength + Buffer.from(oneValValues[k], "utf-8").length);
            length += encodedLength;
            length += Buffer.from(oneValValues[k], "utf-8").length;
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(new bn_js_1.BN(1));
            writer.writeCompactSize(encodedLength + Buffer.from(oneValValues[k], "utf-8").length);
            writer.writeVarSlice(Buffer.from(oneValValues[k], "utf-8"));
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else if (objTypeKey == VDXF_Data.DataByteVectorKey().vdxfid) {
            let length = 20;
            length += 1;
            const encodedLength = varuint_1.default.encodingLength(Buffer.from(oneValValues[k], "hex").length);
            length += varuint_1.default.encodingLength(encodedLength + Buffer.from(oneValValues[k], "hex").length);
            length += encodedLength;
            length += Buffer.from(oneValValues[k], "hex").length;
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(new bn_js_1.BN(1));
            writer.writeCompactSize(encodedLength + Buffer.from(oneValValues[k], "hex").length);
            writer.writeVarSlice(Buffer.from(oneValValues[k], "hex"));
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else if (objTypeKey == VDXF_Data.DataCurrencyMapKey().vdxfid) {
            const destinations = Object.keys(oneValValues[k]);
            const values = Object.values(oneValValues[k]);
            const oneCurMap = new CurrencyValueMap_1.CurrencyValueMap({ value_map: new Map(destinations.map((key, index) => [key, new bn_js_1.BN(values[index])])), multivalue: true });
            let length = 20;
            length += 1;
            length += varuint_1.default.encodingLength(oneCurMap.getByteLength());
            length += oneCurMap.getByteLength();
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(new bn_js_1.BN(1));
            writer.writeCompactSize(oneCurMap.getByteLength());
            writer.writeSlice(oneCurMap.toBuffer());
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else if (objTypeKey == VDXF_Data.DataRatingsKey().vdxfid) {
            const version = new bn_js_1.BN(oneValValues[k].version);
            const trustLevel = new bn_js_1.BN(oneValValues[k].trustLevel);
            const destinations = Object.keys(oneValValues[k].rating);
            const values = Object.values(oneValValues[k]);
            const oneRatingMap = new Rating_1.Rating({ ratings: new Map(destinations.map((key, index) => [key, Buffer.from(values[index], 'hex')])), version, trustLevel });
            let length = 20;
            length += varint_1.default.encodingLength(oneRatingMap.version);
            length += varuint_1.default.encodingLength(oneRatingMap.getByteLength());
            length += oneRatingMap.getByteLength();
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(oneRatingMap.version);
            writer.writeCompactSize(oneRatingMap.getByteLength());
            writer.writeSlice(oneRatingMap.toBuffer());
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else if (objTypeKey == VDXF_Data.DataTransferDestinationKey().vdxfid) {
            const transferDest = new TransferDestination_1.TransferDestination(oneValValues[k]);
            let length = 20;
            length += varint_1.default.encodingLength(transferDest.typeNoFlags());
            length += varuint_1.default.encodingLength(transferDest.getByteLength());
            length += transferDest.getByteLength();
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(transferDest.typeNoFlags());
            writer.writeCompactSize(transferDest.getByteLength());
            writer.writeSlice(transferDest.toBuffer());
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else if (objTypeKey == VDXF_Data.ContentMultiMapRemoveKey().vdxfid) {
            const transferDest = new ContentMultiMapRemove_1.ContentMultiMapRemove(oneValValues[k]);
            let length = 20;
            length += varint_1.default.encodingLength(transferDest.version);
            length += varuint_1.default.encodingLength(transferDest.getByteLength());
            length += transferDest.getByteLength();
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(transferDest.version);
            writer.writeCompactSize(transferDest.getByteLength());
            writer.writeSlice(transferDest.toBuffer());
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else if (objTypeKey == VDXF_Data.CrossChainDataRefKey().vdxfid) {
            const transferDest = new CrossChainDataRef_1.CrossChainDataRef(oneValValues[k]);
            let length = 20;
            length += varint_1.default.encodingLength(vdxf_1.VDXF_OBJECT_DEFAULT_VERSION);
            length += varuint_1.default.encodingLength(transferDest.getByteLength());
            length += transferDest.getByteLength();
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(vdxf_1.VDXF_OBJECT_DEFAULT_VERSION);
            writer.writeCompactSize(transferDest.getByteLength());
            writer.writeSlice(transferDest.toBuffer());
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else if (objTypeKey == VDXF_Data.DataDescriptorKey().vdxfid) {
            const descr = DataDescriptor.fromJson(oneValValues[k]);
            let length = 20;
            length += varint_1.default.encodingLength(descr.version);
            length += varuint_1.default.encodingLength(descr.byteLength());
            length += descr.byteLength();
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(descr.version);
            writer.writeCompactSize(descr.byteLength());
            writer.writeSlice(descr.toBuffer());
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else if (objTypeKey == VDXF_Data.MMRDescriptorKey().vdxfid) {
            const descr = MMRDescriptor.fromJson(oneValValues[k]);
            let length = 20;
            length += varint_1.default.encodingLength(descr.version);
            length += varuint_1.default.encodingLength(descr.byteLength());
            length += descr.byteLength();
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(descr.version);
            writer.writeCompactSize(descr.byteLength());
            writer.writeSlice(descr.toBuffer());
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else if (objTypeKey == VDXF_Data.SignatureDataKey().vdxfid) {
            const sigData = new SignatureData_1.SignatureData(oneValValues[k]);
            let length = 20;
            length += varint_1.default.encodingLength(sigData.version);
            length += varuint_1.default.encodingLength(sigData.getByteLength());
            length += sigData.getByteLength();
            const writer = new BufferWriter(Buffer.alloc(length));
            writer.writeSlice((0, address_1.fromBase58Check)(objTypeKey).hash);
            writer.writeVarInt(sigData.version);
            writer.writeCompactSize(sigData.getByteLength());
            writer.writeSlice(sigData.toBuffer());
            ss = Buffer.concat([ss, writer.buffer]);
        }
        else {
            throw new Error("contentmap invalid or unrecognized vdxfkey for object type: " + oneValValues[k]);
        }
    }
    return ss;
};
exports.VectorEncodeVDXFUni = VectorEncodeVDXFUni;
