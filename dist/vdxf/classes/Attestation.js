"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attestation = void 0;
const varuint_1 = require("../../utils/varuint");
const bufferutils_1 = require("../../utils/bufferutils");
const createHash = require("create-hash");
const address_1 = require("../../utils/address");
const vdxf_1 = require("../../constants/vdxf");
const __1 = require("../");
const MMR_1 = require("./MMR");
const bn_js_1 = require("bn.js");
const { BufferReader, BufferWriter } = bufferutils_1.default;
const ATTESTATION_TYPE_DATA = 1;
const ATTESTATION_TYPE_HASH = 2;
class Attestation extends __1.VDXFObject {
    constructor(vdxfkey = "", data) {
        super(vdxfkey);
        if (data) {
            if (data === null || data === void 0 ? void 0 : data.type)
                this.type = data.type;
            if (data === null || data === void 0 ? void 0 : data.nIndex)
                this.nIndex = data.nIndex;
            if (data === null || data === void 0 ? void 0 : data.components)
                this.components = data.components;
            if (data === null || data === void 0 ? void 0 : data.signatures)
                this.signatures = data.signatures;
        }
    }
    dataByteLength() {
        let byteLength = 0;
        byteLength += varuint_1.default.encodingLength(this.type);
        byteLength += varuint_1.default.encodingLength(this.nIndex);
        byteLength += varuint_1.default.encodingLength(this.components.length);
        for (const n of this.components) {
            byteLength += varuint_1.default.encodingLength(n.type);
            if (n.type === ATTESTATION_TYPE_DATA) {
                byteLength += 20; //key
                byteLength += 32; //salt
                byteLength += varuint_1.default.encodingLength(Buffer.from(n.value, "utf8").length);
                byteLength += Buffer.from(n.value, "utf8").length;
            }
            else if (n.type === ATTESTATION_TYPE_HASH) {
                byteLength += 32; //hash
            }
            else {
                throw new Error("Attestation Type not supported");
            }
        }
        const objKeys = Object.keys(this.signatures);
        byteLength += varuint_1.default.encodingLength(objKeys.length);
        for (const item of objKeys) {
            byteLength += 20; //key
            byteLength += varuint_1.default.encodingLength(Buffer.from(this.signatures[item], "base64").length);
            byteLength += Buffer.from(this.signatures[item], "base64").length;
        }
        return byteLength;
    }
    toDataBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
        bufferWriter.writeCompactSize(this.type);
        bufferWriter.writeCompactSize(this.nIndex);
        bufferWriter.writeCompactSize(this.components.length);
        for (const n of this.components) {
            bufferWriter.writeCompactSize(n.type);
            if (n.type === ATTESTATION_TYPE_DATA) {
                bufferWriter.writeSlice((0, address_1.fromBase58Check)(n.attestationKey).hash);
                bufferWriter.writeSlice(Buffer.from(n.salt, "hex"));
                bufferWriter.writeCompactSize(Buffer.from(n.value, "utf8").length);
                bufferWriter.writeSlice(Buffer.from(n.value, "utf8"));
            }
            else if (n.type === ATTESTATION_TYPE_HASH) {
                bufferWriter.writeSlice(Buffer.from(n.hash, "hex"));
            }
            else {
                throw new Error("Attestation Type not supported");
            }
        }
        const objKeys = Object.keys(this.signatures);
        bufferWriter.writeCompactSize(objKeys.length);
        for (const item of objKeys) {
            bufferWriter.writeSlice((0, address_1.fromBase58Check)(item).hash);
            bufferWriter.writeVarSlice(Buffer.from(this.signatures[item], "base64"));
        }
        return bufferWriter.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const attestationsByteLength = reader.readCompactSize();
        this.type = reader.readVarInt().toNumber();
        this.nIndex = reader.readVarInt().toNumber();
        this.components = new Array();
        const componentsMapSize = reader.readVarInt();
        for (var i = 0; i < componentsMapSize.toNumber(); i++) {
            const type = reader.readVarInt().toNumber();
            if (type === ATTESTATION_TYPE_DATA) {
                const attestationKey = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
                const salt = Buffer.from(reader.readSlice(32)).toString('hex');
                const value = Buffer.from(reader.readVarSlice()).toString('utf8');
                this.components.push({ type, attestationKey, salt, value });
            }
            else if (type === ATTESTATION_TYPE_HASH) {
                const hash = Buffer.from(reader.readSlice(32)).toString('hex');
                this.components.push({ type, hash });
            }
            else {
                throw new Error("Attestation Type not supported");
            }
        }
        const signaturesSize = reader.readVarInt();
        this.signatures = {};
        for (var i = 0; i < signaturesSize.toNumber(); i++) {
            const attestor = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
            const signature = reader.readVarSlice().toString('base64');
            this.signatures[attestor] = signature;
        }
        return reader.offset;
    }
    getMMR() {
        return __awaiter(this, void 0, void 0, function* () {
            const attestationHashes = this.sortHashes();
            if (!this.mmr) {
                this.mmr = new MMR_1.MMR();
            }
            for (var i = 0; i < attestationHashes.length; i++) {
                yield this.mmr.append(attestationHashes[i], i);
            }
            return this.mmr;
        });
    }
    routeHash() {
        return __awaiter(this, void 0, void 0, function* () {
            this.getMMR();
            return this.mmr.getRoot();
        });
    }
    getHash(n) {
        if (n.type === ATTESTATION_TYPE_DATA) {
            const bufferWriter = new BufferWriter(Buffer.alloc(20 +
                32 +
                varuint_1.default.encodingLength(Buffer.from(n.value, "utf8").length) +
                Buffer.from(n.value, "utf8").length));
            bufferWriter.writeSlice((0, address_1.fromBase58Check)(n.attestationKey).hash);
            bufferWriter.writeSlice(Buffer.from(n.salt, "hex"));
            bufferWriter.writeCompactSize(Buffer.from(n.value, "utf8").length);
            bufferWriter.writeSlice(Buffer.from(n.value, "utf8"));
            return createHash("sha256").update(bufferWriter.buffer).digest();
        }
        else if (n.type === ATTESTATION_TYPE_HASH) {
            return Buffer.from(n.hash, "hex");
        }
        else {
            throw new Error("Attestation Type not supported");
        }
    }
    sortHashes() {
        const hashArray = this.components.map((item) => this.getHash(item));
        const sortedHashArray = hashArray.sort((a, b) => (new bn_js_1.BN(a.toString('hex'), 16).gt(new bn_js_1.BN(b.toString('hex'), 16))) ? 0 : -1);
        return sortedHashArray;
    }
}
exports.Attestation = Attestation;
