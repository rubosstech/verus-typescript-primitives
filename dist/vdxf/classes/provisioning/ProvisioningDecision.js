"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisioningDecision = exports.ProvisioningResult = void 0;
const bufferutils_1 = require("../../../utils/bufferutils");
const varuint_1 = require("../../../utils/varuint");
const Decision_1 = require("../Decision");
const Context_1 = require("../Context");
const ProvisioningRequest_1 = require("./ProvisioningRequest");
const __1 = require("../../");
const Hash160_1 = require("../Hash160");
class ProvisioningResult extends Context_1.Context {
    constructor(kv = {}) {
        super(kv, __1.LOGIN_CONSENT_PROVISIONING_RESULT_VDXF_KEY.vdxfid);
    }
}
exports.ProvisioningResult = ProvisioningResult;
class ProvisioningDecision extends Decision_1.Decision {
    constructor(decision = {
        decision_id: "",
        created_at: 0,
        request: new ProvisioningRequest_1.ProvisioningRequest(),
    }) {
        super({
            decision_id: decision.decision_id,
            created_at: decision.created_at,
            salt: decision.salt,
            context: decision.context,
            request: decision.request,
        }, __1.LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY.vdxfid);
        this.error_key = decision.error_key;
        this.error_desc = decision.error_desc;
        this.result = decision.result;
        this.info_text = decision.info_text;
        this.request = new ProvisioningRequest_1.ProvisioningRequest(decision.request);
    }
    dataByteLength() {
        const errorKeyLength = this.error_key
            ? Hash160_1.Hash160.fromAddress(this.error_key, true).byteLength()
            : Hash160_1.Hash160.getEmpty().byteLength();
        const errorDescBuf = Buffer.from(this.error_desc, "utf-8");
        const errorDescLength = errorDescBuf.length + varuint_1.default.encodingLength(errorDescBuf.length);
        const resultLength = this.result
            ? this.result.byteLength()
            : new ProvisioningResult({}).byteLength();
        const infoTextBuf = Buffer.from(this.info_text, "utf-8");
        const infoTextLength = infoTextBuf.length + varuint_1.default.encodingLength(infoTextBuf.length);
        return (super.dataByteLength() +
            errorKeyLength +
            errorDescLength +
            resultLength +
            infoTextLength);
    }
    toDataBuffer() {
        const superBuf = super.toDataBuffer();
        const errorKeyBuf = this.error_key
            ? Hash160_1.Hash160.fromAddress(this.error_key, true).toBuffer()
            : Hash160_1.Hash160.getEmpty().toBuffer();
        const errorDescBuf = Buffer.from(this.error_desc, "utf-8");
        const resultBuf = this.result
            ? this.result.toBuffer()
            : new ProvisioningResult({}).toBuffer();
        const infoTextBuf = Buffer.from(this.info_text, "utf-8");
        const writer = new bufferutils_1.default.BufferWriter(superBuf, super.dataByteLength());
        writer.writeSlice(errorKeyBuf);
        writer.writeVarSlice(errorDescBuf);
        writer.writeSlice(resultBuf);
        writer.writeVarSlice(infoTextBuf);
        return writer.buffer;
    }
    stringable() {
        return {
            vdxfkey: this.vdxfkey,
            decision_id: this.decision_id,
            created_at: this.created_at,
            salt: this.salt,
            error_key: this.error_key,
            error_desc: this.error_desc,
            result: this.result ? this.result.stringable() : null,
            info_text: this.info_text,
            request: this.request.stringable(),
            context: this.context ? this.context.stringable() : null,
        };
    }
    fromDataBuffer(buffer, offset) {
        const decision = new Decision_1.Decision();
        let _offset = decision.fromDataBuffer(buffer, offset, false);
        const reader = new bufferutils_1.default.BufferReader(buffer, _offset);
        this.request = new ProvisioningRequest_1.ProvisioningRequest();
        reader.offset = this.request.fromBuffer(buffer, _offset);
        const _error_key = new Hash160_1.Hash160();
        reader.offset = _error_key.fromBuffer(reader.buffer, true, reader.offset);
        this.error_key = _error_key.toAddress();
        this.error_desc = reader.readVarSlice().toString("utf-8");
        const _result = new ProvisioningResult();
        reader.offset = _result.fromBuffer(reader.buffer, reader.offset);
        this.result = _result;
        this.info_text = reader.readVarSlice().toString("utf-8");
        this.decision_id = decision.decision_id;
        this.created_at = decision.created_at;
        this.salt = decision.salt;
        this.context = decision.context;
        return reader.offset;
    }
}
exports.ProvisioningDecision = ProvisioningDecision;
