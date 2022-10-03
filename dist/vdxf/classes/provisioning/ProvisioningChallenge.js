"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisioningChallenge = void 0;
const bufferutils_1 = require("../../../utils/bufferutils");
const varuint_1 = require("../../../utils/varuint");
const keys_1 = require("../../keys");
const Challenge_1 = require("../Challenge");
class ProvisioningChallenge extends Challenge_1.Challenge {
    constructor(challenge = { challenge_id: "", created_at: 0 }) {
        super({
            challenge_id: challenge.challenge_id,
            created_at: challenge.created_at,
            salt: challenge.salt,
            context: challenge.context,
        }, keys_1.LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY.vdxfid);
        this.name = challenge.name;
    }
    dataByteLength() {
        const nameBuf = Buffer.from(this.name, 'utf-8');
        let length = 0;
        length += nameBuf.length;
        length += varuint_1.default.encodingLength(nameBuf.length);
        return super.dataByteLength() + length;
    }
    toDataBuffer() {
        const superBuf = super.toDataBuffer();
        const writer = new bufferutils_1.default.BufferWriter(superBuf, super.dataByteLength());
        writer.writeVarSlice(Buffer.from(this.name, 'utf-8'));
        return writer.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const challenge = new Challenge_1.Challenge();
        let _offset = challenge.fromDataBuffer(buffer, offset);
        const reader = new bufferutils_1.default.BufferReader(buffer, _offset);
        this.name = reader.readVarSlice().toString('utf-8');
        this.challenge_id = challenge.challenge_id;
        this.created_at = challenge.created_at;
        this.salt = challenge.salt;
        this.context = challenge.context;
        return reader.offset;
    }
}
exports.ProvisioningChallenge = ProvisioningChallenge;
