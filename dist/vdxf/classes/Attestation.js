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
exports.CPartialAttestationProof = exports.Attestation = void 0;
const varuint_1 = require("../../utils/varuint");
const bufferutils_1 = require("../../utils/bufferutils");
const createHash = require("create-hash");
const address_1 = require("../../utils/address");
const vdxf_1 = require("../../constants/vdxf");
const __1 = require("../");
const MMR_1 = require("./MMR");
const keys_1 = require("../keys");
const Hash160_1 = require("./Hash160");
const attestationData_1 = require("./attestationData");
const { BufferReader, BufferWriter } = bufferutils_1.default;
class Attestation extends __1.VDXFObject {
    constructor(data, vdxfkey = keys_1.ATTESTATION_OBJECT.vdxfid) {
        super(vdxfkey);
        if (data) {
            this.data = data.data;
            this.signature = data.signature;
            this.mmr = data.mmr;
            this.system_id = data.system_id;
            this.signing_id = data.signing_id;
        }
    }
    dataByteLength() {
        let byteLength = 0;
        byteLength += this.data.dataByteLength();
        const _system_id = Hash160_1.Hash160.fromAddress(this.system_id);
        const _signing_id = Hash160_1.Hash160.fromAddress(this.signing_id);
        const _signature = this.signature
            ? this.signature
            : new __1.VerusIDSignature({ signature: "" });
        byteLength += _system_id.byteLength();
        byteLength += _signing_id.byteLength();
        byteLength += _signature.byteLength();
        if (this.mmr) {
            byteLength += this.mmr.getbyteLength();
        }
        else {
            byteLength += varuint_1.default.encodingLength(0);
        }
        return byteLength;
    }
    toDataBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
        bufferWriter.writeSlice(this.data.toDataBuffer());
        const _system_id = Hash160_1.Hash160.fromAddress(this.system_id);
        const _signing_id = Hash160_1.Hash160.fromAddress(this.signing_id);
        const _signature = this.signature
            ? this.signature
            : new __1.VerusIDSignature({ signature: "" });
        bufferWriter.writeSlice(_system_id.toBuffer());
        bufferWriter.writeSlice(_signing_id.toBuffer());
        bufferWriter.writeSlice(_signature.toBuffer());
        if (this.mmr) {
            bufferWriter.writeVarSlice(this.mmr.toBuffer());
        }
        else {
            bufferWriter.writeCompactSize(0);
        }
        return bufferWriter.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const attestationsByteLength = reader.readCompactSize(); //dummy read
        if (!this.data) {
            this.data = new attestationData_1.AttestationData();
        }
        reader.offset = this.data.fromDataBuffer(reader.buffer, reader.offset);
        this.system_id = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
        this.signing_id = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
        const _sig = new __1.VerusIDSignature();
        reader.offset = _sig.fromBuffer(reader.buffer, reader.offset);
        this.signature = _sig;
        const leafLength = reader.readCompactSize();
        if (leafLength > 0) {
            const referenceTreeLength = reader.readCompactSize();
            const nodes = {};
            for (var i = 0; i < referenceTreeLength; i++) {
                const nodeIndex = reader.readCompactSize();
                const signature = reader.readVarSlice();
                nodes[nodeIndex] = signature;
            }
            if (Object.keys(nodes).length > 0) {
                this.mmr = new MMR_1.CMerkleMountainRange().fromBuffer(reader.buffer);
            }
        }
        return reader.offset;
    }
    createMMR() {
        if (!this.mmr) {
            this.mmr = new MMR_1.CMerkleMountainRange();
        }
        else {
            return this.mmr;
        }
        for (const [key, item] of this.data.components) {
            this.mmr.add(new MMR_1.CMMRNode(this.getHash(key)));
        }
        return this.mmr;
    }
    rootHash() {
        if (!this.mmr) {
            this.createMMR();
        }
        const view = new MMR_1.CMerkleMountainView(this.mmr);
        return view.GetRoot();
    }
    // returns an attestation with a sparse MMR containing the leaves specified
    getProof(keys) {
        const view = new MMR_1.CMerkleMountainView(this.mmr);
        const attestationItems = new attestationData_1.AttestationData();
        const localCMMR = new MMR_1.CMMRProof();
        keys.forEach((key, index) => {
            view.GetProof(localCMMR, key);
            attestationItems.components.set(key, this.data.components.get(key));
        });
        const attestationAndProof = new CPartialAttestationProof({
            proof: localCMMR,
            componentsArray: attestationItems,
            system_id: this.system_id,
            signing_id: this.signing_id,
        });
        return attestationAndProof;
    }
    checkProof() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const [key, item] of this.data.components) {
                    const hash = this.getHash(key);
                    const proof = null; //await this.mmr.getProof([key], null);
                    if (hash !== proof) {
                        throw new Error("Attestation not found in MMR");
                    }
                }
            }
            catch (e) {
                throw new Error("Error checking MMR");
            }
        });
    }
    getHash(key) {
        let returnBuffer;
        returnBuffer = this.data.components.get(key).toBuffer();
        return createHash("sha256").update(returnBuffer).digest();
    }
}
exports.Attestation = Attestation;
Attestation.TYPE_STRING = 1;
Attestation.TYPE_BYTES = 2;
Attestation.TYPE_BASE64 = 3;
Attestation.TYPE_URL = 4;
class CPartialAttestationProof extends __1.VDXFObject {
    constructor(data, vdxfkey = keys_1.ATTESTATION_VIEW_RESPONSE.vdxfid) {
        super(vdxfkey);
        this.EType = {
            TYPE_INVALID: 0,
            TYPE_ATTESTATION: 1,
            TYPE_LAST: 1
        };
        this.type = this.EType.TYPE_ATTESTATION;
        if (data) {
            this.proof = data.proof || new MMR_1.CMMRProof();
            this.componentsArray = data.componentsArray || new attestationData_1.AttestationData();
            this.system_id = data.system_id;
            this.signing_id = data.signing_id;
        }
    }
    dataByteLength() {
        let byteLength = 0;
        byteLength += varuint_1.default.encodingLength(this.type);
        byteLength += this.proof.dataByteLength();
        byteLength += this.componentsArray.dataByteLength();
        const _system_id = Hash160_1.Hash160.fromAddress(this.system_id);
        const _signing_id = Hash160_1.Hash160.fromAddress(this.signing_id);
        const _signature = this.signature
            ? this.signature
            : new __1.VerusIDSignature({ signature: "" });
        byteLength += _system_id.byteLength();
        byteLength += _signing_id.byteLength();
        byteLength += _signature.byteLength();
        return byteLength;
    }
    toDataBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
        bufferWriter.writeCompactSize(this.type);
        bufferWriter.writeSlice(this.proof.toBuffer());
        bufferWriter.writeSlice(this.componentsArray.toDataBuffer());
        const _system_id = Hash160_1.Hash160.fromAddress(this.system_id);
        const _signing_id = Hash160_1.Hash160.fromAddress(this.signing_id);
        const _signature = this.signature
            ? this.signature
            : new __1.VerusIDSignature({ signature: "" });
        bufferWriter.writeSlice(_system_id.toBuffer());
        bufferWriter.writeSlice(_signing_id.toBuffer());
        bufferWriter.writeSlice(_signature.toBuffer());
        return bufferWriter.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const lengthOfBuffer = reader.readCompactSize(); //dummy read
        this.type = reader.readCompactSize();
        this.proof = new MMR_1.CMMRProof();
        reader.offset = this.proof.fromDataBuffer(reader.buffer, reader.offset);
        this.componentsArray = new attestationData_1.AttestationData();
        reader.offset = this.componentsArray.fromDataBuffer(reader.buffer, reader.offset);
        this.system_id = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
        this.signing_id = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
        const _sig = new __1.VerusIDSignature();
        reader.offset = _sig.fromBuffer(reader.buffer, reader.offset);
        this.signature = _sig;
        return reader.offset;
    }
    checkProof(item) {
        const dataHash = this.componentsArray.getHash(item);
        let currentIndex = 0;
        const component = this.componentsArray.components.get(item);
        for (let value of this.componentsArray.components.values()) {
            if (component == value) {
                return this.proof.proofSequence[currentIndex].safeCheck(dataHash);
            }
            currentIndex++;
        }
        return Buffer.allocUnsafe(32);
    }
}
exports.CPartialAttestationProof = CPartialAttestationProof;
