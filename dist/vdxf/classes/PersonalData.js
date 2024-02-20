"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalData = void 0;
const varuint_1 = require("../../utils/varuint");
const bufferutils_1 = require("../../utils/bufferutils");
const address_1 = require("../../utils/address");
const vdxf_1 = require("../../constants/vdxf");
const __1 = require("..");
const identitydatakeys_1 = require("../identitydatakeys");
const AttestationData_1 = require("./AttestationData");
const { BufferReader, BufferWriter } = bufferutils_1.default;
class PersonalData extends __1.VDXFObject {
    constructor(data, vdxfkey = identitydatakeys_1.PERSONAL_INFO_OBJECT.vdxfid) {
        super(vdxfkey);
        this.id = '';
        this.linkedAttestation = '';
        if (data) {
            Object.assign(this, data);
        }
    }
    dataByteLength() {
        let byteLength = 0;
        byteLength += 1; // type
        byteLength += varuint_1.default.encodingLength(this.id.length);
        byteLength += this.id.length;
        byteLength += varuint_1.default.encodingLength(Object.keys(this.data).length);
        for (const [key, value] of Object.entries(this.data)) {
            byteLength += vdxf_1.HASH160_BYTE_LENGTH; // category
            byteLength += varuint_1.default.encodingLength(value.length);
            for (const attestation of value) {
                byteLength += attestation.dataBytelength();
            }
        }
        byteLength += varuint_1.default.encodingLength(this.linkedAttestation.length);
        byteLength += this.linkedAttestation.length;
        return byteLength;
    }
    toDataBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
        bufferWriter.writeCompactSize(this.type);
        bufferWriter.writeVarSlice(Buffer.from(this.id, 'utf8'));
        bufferWriter.writeCompactSize(Object.keys(this.data).length);
        for (const [key, value] of Object.entries(this.data)) {
            bufferWriter.writeSlice((0, address_1.fromBase58Check)(key).hash);
            bufferWriter.writeCompactSize(value.length);
            for (const attestation of value) {
                bufferWriter.writeSlice(attestation.toBuffer());
            }
        }
        bufferWriter.writeVarSlice(Buffer.from(this.linkedAttestation, 'utf8'));
        return bufferWriter.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new BufferReader(buffer, offset);
        this.type = reader.readCompactSize();
        this.id = reader.readVarSlice().toString('utf8');
        const dataLength = reader.readCompactSize();
        if (!this.data) {
            this.data = {};
        }
        for (var i = 0; i < dataLength; i++) {
            const category = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
            const attestationLength = reader.readCompactSize();
            const attestations = [];
            for (var j = 0; j < attestationLength; j++) {
                const attestation = new AttestationData_1.AttestationDataType(null, (0, address_1.toBase58Check)(reader.buffer.slice(reader.offset, reader.offset + vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION));
                reader.offset = attestation.fromDataBuffer(reader.buffer, reader.offset);
                attestations.push(attestation);
            }
            this.data[category] = attestations;
        }
        this.linkedAttestation = reader.readVarSlice().toString('utf8');
        return reader.offset;
    }
    toJson() {
        return {
            type: this.type,
            id: this.id,
            data: this.data,
            linkedAttestation: this.linkedAttestation
        };
    }
}
exports.PersonalData = PersonalData;
(function (PersonalData) {
    let TYPE;
    (function (TYPE) {
        TYPE[TYPE["REQUEST"] = 1] = "REQUEST";
        TYPE[TYPE["SUBMITTED"] = 2] = "SUBMITTED";
        TYPE[TYPE["DESIGNATED"] = 3] = "DESIGNATED";
    })(TYPE = PersonalData.TYPE || (PersonalData.TYPE = {}));
})(PersonalData = exports.PersonalData || (exports.PersonalData = {}));
