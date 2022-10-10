"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisioningResult = void 0;
const __1 = require("../..");
const bufferutils_1 = require("../../../utils/bufferutils");
const varuint_1 = require("../../../utils/varuint");
const keys_1 = require("../../keys");
const Hash160_1 = require("../Hash160");
class ProvisioningResult extends __1.VDXFObject {
    constructor(result = { state: "" }) {
        super(keys_1.LOGIN_CONSENT_PROVISIONING_RESULT_VDXF_KEY.vdxfid);
        this.state = result.state;
        this.error_desc = result.error_desc;
        this.error_key = result.error_key;
        this.identity_address = result.identity_address;
        this.info_uri = result.info_uri;
        this.reservation_txid = result.reservation_txid;
        this.provisioning_txid = result.provisioning_txid;
    }
    dataByteLength() {
        const stateLength = Hash160_1.Hash160.fromAddress(this.state).byteLength();
        const errorKeyLength = this.error_key
            ? Hash160_1.Hash160.fromAddress(this.error_key, true).byteLength()
            : Hash160_1.Hash160.getEmpty().byteLength();
        const errorDescBuf = this.error_desc == null
            ? Buffer.alloc(0)
            : Buffer.from(this.error_desc, "utf-8");
        const errorDescLength = errorDescBuf.length + varuint_1.default.encodingLength(errorDescBuf.length);
        const idAddrLength = this.identity_address
            ? Hash160_1.Hash160.fromAddress(this.identity_address, true).byteLength()
            : Hash160_1.Hash160.getEmpty().byteLength();
        const infoUriBuf = this.info_uri == null ? Buffer.alloc(0) : Buffer.from(this.info_uri, "utf-8");
        const infoUriLength = infoUriBuf.length + varuint_1.default.encodingLength(infoUriBuf.length);
        const reservationTxidBuf = this.reservation_txid == null
            ? Buffer.alloc(0)
            : Buffer.from(this.reservation_txid, "hex");
        const reservationTxidLength = reservationTxidBuf.length + varuint_1.default.encodingLength(reservationTxidBuf.length);
        const provisioningTxidBuf = this.provisioning_txid == null
            ? Buffer.alloc(0)
            : Buffer.from(this.provisioning_txid, "hex");
        const provisioningTxidLength = provisioningTxidBuf.length + varuint_1.default.encodingLength(provisioningTxidBuf.length);
        return (stateLength +
            errorKeyLength +
            errorDescLength +
            idAddrLength +
            infoUriLength +
            reservationTxidLength +
            provisioningTxidLength);
    }
    toDataBuffer() {
        const writer = new bufferutils_1.default.BufferWriter(Buffer.alloc(this.dataByteLength()));
        writer.writeSlice(Hash160_1.Hash160.fromAddress(this.state).toBuffer());
        writer.writeSlice(this.error_key
            ? Hash160_1.Hash160.fromAddress(this.error_key, true).toBuffer()
            : Hash160_1.Hash160.getEmpty().toBuffer());
        writer.writeVarSlice(this.error_desc == null ? Buffer.alloc(0) : Buffer.from(this.error_desc, "utf-8"));
        writer.writeSlice(this.identity_address
            ? Hash160_1.Hash160.fromAddress(this.identity_address, true).toBuffer()
            : Hash160_1.Hash160.getEmpty().toBuffer());
        writer.writeVarSlice(this.info_uri == null ? Buffer.alloc(0) : Buffer.from(this.info_uri, "utf-8"));
        writer.writeVarSlice(this.reservation_txid == null
            ? Buffer.alloc(0)
            : (0, bufferutils_1.reverseBuffer)(Buffer.from(this.reservation_txid, "hex")));
        writer.writeVarSlice(this.provisioning_txid == null
            ? Buffer.alloc(0)
            : (0, bufferutils_1.reverseBuffer)(Buffer.from(this.provisioning_txid, "hex")));
        return writer.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const resultLength = reader.readVarInt();
        if (resultLength == 0) {
            throw new Error("Cannot create provisioning result from empty buffer");
        }
        else {
            const _state = new Hash160_1.Hash160();
            reader.offset = _state.fromBuffer(reader.buffer, false, reader.offset);
            this.state = _state.toAddress();
            const _error_key = new Hash160_1.Hash160();
            reader.offset = _error_key.fromBuffer(reader.buffer, true, reader.offset);
            this.error_key = _error_key.toAddress();
            this.error_desc = reader.readVarSlice().toString('utf8');
            const _identity_address = new Hash160_1.Hash160();
            reader.offset = _identity_address.fromBuffer(reader.buffer, true, reader.offset);
            this.identity_address = _identity_address.toAddress();
            this.info_uri = reader.readVarSlice().toString('utf8');
            const reservationTxidSlice = reader.readVarSlice();
            const reservationTxidBuf = Buffer.alloc(reservationTxidSlice.length);
            const reservationTxidWriter = new bufferutils_1.default.BufferWriter(reservationTxidBuf);
            reservationTxidWriter.writeSlice(reservationTxidSlice);
            this.reservation_txid = (0, bufferutils_1.reverseBuffer)(reservationTxidWriter.buffer).toString('hex');
            const provisioningTxidSlice = reader.readVarSlice();
            const provisioningTxidBuf = Buffer.alloc(provisioningTxidSlice.length);
            const provisioningTxidWriter = new bufferutils_1.default.BufferWriter(provisioningTxidBuf);
            provisioningTxidWriter.writeSlice(provisioningTxidSlice);
            this.provisioning_txid = (0, bufferutils_1.reverseBuffer)(provisioningTxidWriter.buffer).toString('hex');
        }
        return reader.offset;
    }
}
exports.ProvisioningResult = ProvisioningResult;
