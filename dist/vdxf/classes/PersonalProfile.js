"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalProfileDataStore = exports.DataCategory = void 0;
const varuint_1 = require("../../utils/varuint");
const bufferutils_1 = require("../../utils/bufferutils");
const address_1 = require("../../utils/address");
const vdxf_1 = require("../../constants/vdxf");
const __1 = require("..");
const Attestation_1 = require("./Attestation");
const identitykeys = require("../identityDataKeys");
const { BufferReader, BufferWriter } = bufferutils_1.default;
class DataCategory {
    constructor(data, category, vdxfid) {
        if (data && data[0] instanceof __1.VDXFObject) {
            this.data = data;
        }
        else if (data) {
            this.data = data.map(key => { return Attestation_1.AttestationDataType.getDataItem(key.vdxfid, null); });
        }
        this.category = category;
        this.vdxfid = vdxfid;
    }
}
exports.DataCategory = DataCategory;
class PersonalDataCategory extends DataCategory {
    constructor() {
        super([
            identitykeys.IDENTITYDATA_FIRSTNAME,
            identitykeys.IDENTITYDATA_LASTNAME,
            identitykeys.IDENTITYDATA_DATEOFBIRTH,
            identitykeys.IDENTITYDATA_HOMEADDRESS_COUNTRY
        ], "personal", identitykeys.IDENTITYDATA_PERSONAL_DETAILS.vdxfid);
    }
}
class ContactDataCategory extends DataCategory {
    constructor() {
        super([
            identitykeys.IDENTITYDATA_EMAIL,
            identitykeys.IDENTITYDATA_PHONENUMBER
        ], "contact", identitykeys.IDENTITYDATA_CONTACT.vdxfid);
    }
}
class LocationDataCategory extends DataCategory {
    constructor() {
        super([
            identitykeys.IDENTITYDATA_HOMEADDRESS_STREET1,
            identitykeys.IDENTITYDATA_HOMEADDRESS_STREET2,
            identitykeys.IDENTITYDATA_HOMEADDRESS_CITY,
            identitykeys.IDENTITYDATA_HOMEADDRESS_REGION,
            identitykeys.IDENTITYDATA_HOMEADDRESS_POSTCODE
        ], "locations", identitykeys.IDENTITYDATA_LOCATIONS.vdxfid);
    }
}
const defaultPersonalProfileDataTemplate = [
    new PersonalDataCategory(),
    new ContactDataCategory(),
    new LocationDataCategory()
];
class PersonalProfileDataStore extends __1.VDXFObject {
    constructor(data) {
        super(identitykeys.PERSONAL_INFO_OBJECT.vdxfid);
        if (data) {
            this.data = {};
            for (const item of data) {
                this.data[item.category] = item;
            }
        }
        else {
            this.data = {};
            for (const item of defaultPersonalProfileDataTemplate) {
                this.data[item.category] = item;
            }
        }
    }
    dataByteLength() {
        let byteLength = 0;
        byteLength += varuint_1.default.encodingLength(Object.keys(this.data).length);
        for (const [key, value] of Object.entries(this.data)) {
            byteLength += vdxf_1.HASH160_BYTE_LENGTH; // category
            byteLength += varuint_1.default.encodingLength(value.data.length);
            for (const attestation of value.data) {
                byteLength += attestation.toBuffer().length;
            }
        }
        return byteLength;
    }
    toDataBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
        bufferWriter.writeCompactSize(Object.keys(this.data).length);
        for (const [key, value] of Object.entries(this.data)) {
            bufferWriter.writeSlice((0, address_1.fromBase58Check)(value.vdxfid).hash);
            bufferWriter.writeCompactSize(value.data.length);
            for (const dataType of value.data) {
                bufferWriter.writeSlice(dataType.toBuffer());
            }
        }
        return bufferWriter.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new BufferReader(buffer, offset);
        const dataLength = reader.readCompactSize();
        if (!this.data) {
            this.data = {};
        }
        for (var i = 0; i < dataLength; i++) {
            const vdxfkey = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
            const dataLength = reader.readCompactSize();
            const data = [];
            for (var j = 0; j < dataLength; j++) {
                const attestation = Attestation_1.AttestationDataType.getDataItem((0, address_1.toBase58Check)(reader.buffer.slice(reader.offset, reader.offset + vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION), null);
                reader.offset = attestation.fromBuffer(reader.buffer, reader.offset);
                data.push(attestation);
            }
            const categoryType = Object.entries(this.data).find(([key, value]) => value.vdxfid === vdxfkey);
            this.data[categoryType[1].category].data = data;
        }
        return reader.offset;
    }
    toJson() {
        return {
            data: this.data,
        };
    }
}
exports.PersonalProfileDataStore = PersonalProfileDataStore;
