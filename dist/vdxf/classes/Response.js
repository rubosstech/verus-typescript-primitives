"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const Decision_1 = require("./Decision");
const __1 = require("../");
const keys_1 = require("../keys");
class Response extends __1.VDXFObject {
    constructor(response) {
        super(__1.LOGIN_CONSENT_RESPONSE_VDXF_KEY.vdxfid);
        this.chain_id = response.chain_id;
        this.signing_id = response.signing_id;
        this.decision = new Decision_1.Decision(response.decision);
        if (response.signature) {
            this.signature = new __1.VerusIDSignature(response.signature, keys_1.LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY);
        }
    }
    getSignedData() {
        return this.decision.toString();
    }
    stringable() {
        return {
            vdxfkey: this.vdxfkey,
            chain_id: this.chain_id,
            signature: this.signature,
            signing_id: this.signing_id,
            decision: this.decision.stringable()
        };
    }
}
exports.Response = Response;
