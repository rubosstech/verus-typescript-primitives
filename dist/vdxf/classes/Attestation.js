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
exports.AttestationProof = exports.Attestation = void 0;
const varuint_1 = require("../../utils/varuint");
const bufferutils_1 = require("../../utils/bufferutils");
const createHash = require("create-hash");
const address_1 = require("../../utils/address");
const vdxf_1 = require("../../constants/vdxf");
const __1 = require("../");
const MMR_1 = require("./MMR");
const { BufferReader, BufferWriter } = bufferutils_1.default;
class Attestation extends __1.VDXFObject {
    constructor(vdxfkey = "", data) {
        super(vdxfkey);
        if (data) {
            if (data === null || data === void 0 ? void 0 : data.components)
                this.components = data.components;
            if (data === null || data === void 0 ? void 0 : data.signatures)
                this.signatures = data.signatures;
        }
    }
    dataByteLength() {
        let byteLength = 0;
        byteLength += varuint_1.default.encodingLength(this.components.length);
        for (const n of this.components) {
            byteLength += 20; //key
            byteLength += 32; //salt
            byteLength += varuint_1.default.encodingLength(Buffer.from(n.value, "utf8").length);
            byteLength += Buffer.from(n.value, "utf8").length;
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
        bufferWriter.writeCompactSize(this.components.length);
        for (const n of this.components) {
            bufferWriter.writeSlice((0, address_1.fromBase58Check)(n.attestationKey).hash);
            bufferWriter.writeSlice(Buffer.from(n.salt, "hex"));
            bufferWriter.writeCompactSize(Buffer.from(n.value, "utf8").length);
            bufferWriter.writeSlice(Buffer.from(n.value, "utf8"));
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
        this.components = new Array();
        const componentsMapSize = reader.readVarInt();
        for (var i = 0; i < componentsMapSize.toNumber(); i++) {
            const attestationKey = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
            const salt = Buffer.from(reader.readSlice(32)).toString('hex');
            const value = Buffer.from(reader.readVarSlice()).toString('utf8');
            this.components.push({ attestationKey, salt, value });
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
    createMMR() {
        return __awaiter(this, void 0, void 0, function* () {
            const attestationHashes = this.getHashes();
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
            yield this.createMMR();
            return yield this.mmr.getRoot();
        });
    }
    getRoot() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mmr.getRoot();
        });
    }
    getProof(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemMaps = new Map();
            keys.forEach((key, index) => { itemMaps.set(index, this.components[key]); });
            const reply = new AttestationProof("", { component: itemMaps, mmr: yield this.mmr.getProof(keys, null) });
            return reply;
        });
    }
    getHash(n) {
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
    getHashes() {
        const hashArray = [];
        this.components.forEach((item) => hashArray.push(this.getHash(item)));
        return hashArray;
    }
}
exports.Attestation = Attestation;
class AttestationProof extends __1.VDXFObject {
    constructor(vdxfkey = "", data) {
        super(vdxfkey);
        if (data) {
            if (data === null || data === void 0 ? void 0 : data.component)
                this.component = data.component;
            if (data === null || data === void 0 ? void 0 : data.mmr)
                this.mmr = data.mmr;
        }
    }
    dataByteLength() {
        let byteLength = 0;
        byteLength += varuint_1.default.encodingLength(this.component.size);
        for (const [key, item] of this.component) {
            byteLength += varuint_1.default.encodingLength(this.component.size);
            byteLength += varuint_1.default.encodingLength(key);
            byteLength += 20; //key
            byteLength += 32; //salt
            byteLength += varuint_1.default.encodingLength(Buffer.from(item.value, "utf8").length);
            byteLength += Buffer.from(item.value, "utf8").length;
        }
        byteLength += varuint_1.default.encodingLength(this.mmr.db.getLeafLength());
        const nodes = this.mmr.db.getNodes();
        const objKeys = Object.keys(nodes);
        byteLength += varuint_1.default.encodingLength(objKeys.length);
        for (const item of objKeys) {
            byteLength += varuint_1.default.encodingLength(parseInt(item));
            byteLength += varuint_1.default.encodingLength(nodes[item].length);
        }
        return byteLength;
    }
    toDataBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
        bufferWriter.writeCompactSize(this.component.size);
        for (const [key, item] of this.component) {
            bufferWriter.writeCompactSize(key);
            bufferWriter.writeSlice((0, address_1.fromBase58Check)(item.attestationKey).hash);
            bufferWriter.writeSlice(Buffer.from(item.salt, "hex"));
            bufferWriter.writeVarSlice(Buffer.from(item.value, "utf8"));
        }
        bufferWriter.writeCompactSize(this.mmr.db.getLeafLength());
        const nodes = this.mmr.db.getNodes();
        const objKeys = Object.keys(nodes);
        for (const item of objKeys) {
            bufferWriter.writeCompactSize(parseInt(item));
            bufferWriter.writeVarSlice(nodes[item]);
        }
        return bufferWriter.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const attestationsByteLength = reader.readCompactSize(); //dummy read
        const componentsLength = reader.readCompactSize();
        this.component = new Map();
        for (var i = 0; i < componentsLength; i++) {
            const key = reader.readCompactSize();
            const attestationKey = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
            const salt = Buffer.from(reader.readSlice(32)).toString('hex');
            const value = Buffer.from(reader.readVarSlice()).toString('utf8');
            this.component.set(key, { attestationKey, salt, value });
        }
        const referenceTreeLength = reader.readVarInt();
        const nodes = {};
        for (var i = 0; i < referenceTreeLength.toNumber(); i++) {
            const nodeIndex = reader.readCompactSize();
            const signature = reader.readVarSlice();
            nodes[nodeIndex] = signature;
        }
        this.mmr = new MMR_1.MMR(new MMR_1.MemoryBasedDb(referenceTreeLength, nodes));
        return reader.offset;
    }
    routeHash() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mmr.getRoot();
        });
    }
    checkProof() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const [key, item] of this.component) {
                    const hash = this.getHash(key);
                    const proof = yield this.mmr.getProof([key], null);
                    if (hash !== proof) {
                        throw new Error("Attestation not found in MMR");
                    }
                }
            }
            catch (e) {
            }
        });
    }
    getHash(key) {
        const bufferWriter = new BufferWriter(Buffer.alloc(20 +
            32 +
            varuint_1.default.encodingLength(Buffer.from(this.component.get(key).value, "utf8").length) +
            Buffer.from(this.component.get(key).value, "utf8").length));
        bufferWriter.writeSlice((0, address_1.fromBase58Check)(this.component.get(key).attestationKey).hash);
        bufferWriter.writeSlice(Buffer.from(this.component.get(key).salt, "hex"));
        bufferWriter.writeCompactSize(Buffer.from(this.component.get(key).value, "utf8").length);
        bufferWriter.writeSlice(Buffer.from(this.component.get(key).value, "utf8"));
        return createHash("sha256").update(bufferWriter.buffer).digest();
    }
}
exports.AttestationProof = AttestationProof;
