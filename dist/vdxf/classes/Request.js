"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const __1 = require("../");
const keys_1 = require("../keys");
const Challenge_1 = require("./Challenge");
class Request extends __1.VDXFObject {
    constructor(request) {
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
}
exports.Request = Request;
