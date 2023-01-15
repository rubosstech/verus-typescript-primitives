"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerusIDSignature = exports.Utf8DataVdxfObject = exports.VDXFObject = void 0;
const base64url_1 = require("base64url");
const createHash = require("create-hash");
const vdxf_1 = require("../constants/vdxf");
const address_1 = require("../utils/address");
const bufferutils_1 = require("../utils/bufferutils");
const varuint_1 = require("../utils/varuint");
const keys_1 = require("./keys");
__exportStar(require("./keys"), exports);
__exportStar(require("./scopes"), exports);
class VDXFObject {
    constructor(key = "") {
        this.vdxfkey = key;
        this.version = vdxf_1.DEFAULT_VERSION;
    }
    toJson() {
        return {};
    }
    toString() {
        return base64url_1.default.encode(this.toBuffer());
    }
    dataByteLength() {
        return 0;
    }
    toDataBuffer() {
        return Buffer.alloc(0);
    }
    fromDataBuffer(buffer, offset = 0) {
        return offset;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const keyHash = reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH);
        const version = reader.readVarInt();
        this.vdxfkey = (0, address_1.toBase58Check)(keyHash, vdxf_1.I_ADDR_VERSION);
        this.version = version;
        if (offset < buffer.length - 1) {
            reader.offset = this.fromDataBuffer(reader.buffer, reader.offset);
        }
        return reader.offset;
    }
    byteLength() {
        const dataLength = this.dataByteLength();
        const keyLength = (0, address_1.fromBase58Check)(this.vdxfkey).hash.length;
        const versionEncodingLength = varuint_1.default.encodingLength(this.version);
        const dataEncodingLength = varuint_1.default.encodingLength(dataLength);
        return dataLength + keyLength + versionEncodingLength + dataEncodingLength;
    }
    toBuffer() {
        const key = (0, address_1.fromBase58Check)(this.vdxfkey);
        const dataLength = this.dataByteLength();
        const buffer = Buffer.alloc(this.byteLength());
        const writer = new bufferutils_1.default.BufferWriter(buffer);
        writer.writeSlice(key.hash);
        writer.writeVarInt(this.version);
        if (dataLength) {
            writer.writeVarSlice(this.toDataBuffer());
        }
        return writer.buffer;
    }
    toSha256() {
        return createHash("sha256").update(this.toBuffer()).digest();
    }
}
exports.VDXFObject = VDXFObject;
class Utf8DataVdxfObject extends VDXFObject {
    constructor(data = "", vdxfkey = "") {
        super(vdxfkey);
        this.data = data;
    }
    dataByteLength() {
        return this.toDataBuffer().length;
    }
    toDataBuffer() {
        return Buffer.from(this.data, 'utf-8');
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        this.data = reader.readVarSlice().toString('utf-8');
        return reader.offset;
    }
    toJson() {
        return {
            data: this.data,
            vdxfkey: this.vdxfkey
        };
    }
}
exports.Utf8DataVdxfObject = Utf8DataVdxfObject;
class VerusIDSignature extends VDXFObject {
    constructor(sig = { signature: "" }, vdxfkey = keys_1.LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY) {
        super(vdxfkey.vdxfid);
        this.signature = sig.signature;
    }
    dataByteLength() {
        return this.toDataBuffer().length;
    }
    toDataBuffer() {
        return Buffer.from(this.signature, "base64");
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        this.signature = reader.readVarSlice().toString("base64");
        return reader.offset;
    }
    toJson() {
        return {
            vdxfkey: this.vdxfkey,
            signature: this.signature,
        };
    }
}
exports.VerusIDSignature = VerusIDSignature;
