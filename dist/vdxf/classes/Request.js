"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const __1 = require("../");
const keys_1 = require("../keys");
const Challenge_1 = require("./Challenge");
const Hash160_1 = require("./Hash160");
const bufferutils_1 = require("../../utils/bufferutils");
const vdxf_1 = require("../../constants/vdxf");
const address_1 = require("../../utils/address");
class Request extends __1.VDXFObject {
    constructor(request = {
        system_id: "",
        signing_id: "",
        challenge: new Challenge_1.Challenge(),
    }) {
        super(__1.LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid);
        this.system_id = request.system_id;
        this.signing_id = request.signing_id;
        this.signature = request.signature
            ? new __1.VerusIDSignature(request.signature, keys_1.LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY)
            : undefined;
        this.challenge = new Challenge_1.Challenge(request.challenge);
    }
    getSignedData() {
        return this.challenge.toString();
    }
    stringable() {
        return {
            vdxfkey: this.vdxfkey,
            system_id: this.system_id,
            signing_id: this.signing_id,
            signature: this.signature ? this.signature.stringable() : this.signature,
            challenge: this.challenge.stringable(),
        };
    }
    dataByteLength() {
        let length = 0;
        const _system_id = Hash160_1.Hash160.fromAddress(this.system_id);
        const _signing_id = Hash160_1.Hash160.fromAddress(this.signing_id);
        const _signature = this.signature
            ? this.signature
            : new __1.VerusIDSignature({ signature: "" }, keys_1.LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY);
        length += _system_id.byteLength();
        length += _signing_id.byteLength();
        length += _signature.byteLength();
        length += this.challenge.byteLength();
        return length;
    }
    toDataBuffer() {
        const writer = new bufferutils_1.default.BufferWriter(Buffer.alloc(this.dataByteLength()));
        const _system_id = Hash160_1.Hash160.fromAddress(this.system_id);
        const _signing_id = Hash160_1.Hash160.fromAddress(this.signing_id);
        const _signature = this.signature
            ? this.signature
            : new __1.VerusIDSignature({ signature: "" }, keys_1.LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY);
        writer.writeSlice(_system_id.toBuffer());
        writer.writeSlice(_signing_id.toBuffer());
        writer.writeSlice(_signature.toBuffer());
        writer.writeSlice(this.challenge.toBuffer());
        return writer.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const reqLength = reader.readVarInt();
        if (reqLength == 0) {
            throw new Error("Cannot create request from empty buffer");
        }
        else {
            this.system_id = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
            this.signing_id = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
            const _sig = new __1.VerusIDSignature();
            reader.offset = _sig.fromBuffer(reader.buffer, reader.offset);
            this.signature = _sig;
            const _challenge = new Challenge_1.Challenge();
            reader.offset = _challenge.fromBuffer(reader.buffer, reader.offset);
            this.challenge = _challenge;
        }
        return reader.offset;
    }
    toWalletDeeplinkUri() {
        return `${__1.WALLET_VDXF_KEY.vdxfid.toLowerCase()}://x-callback-url/${__1.LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid}/?${__1.LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid}=${this.toString()}`;
    }
    static fromWalletDeeplinkUri(uri) {
        const split = uri.split(`${__1.LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid}=`);
        const req = new Request();
        req.fromBuffer(Buffer.from(split[1], 'base64url'));
        return req;
    }
}
exports.Request = Request;
