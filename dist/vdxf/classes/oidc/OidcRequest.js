"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OidcRequest = void 0;
const __1 = require("../..");
const keys_1 = require("../../keys");
const OidcChallenge_1 = require("./OidcChallenge");
class OidcRequest extends __1.VDXFObject {
    constructor(request) {
        super(__1.LOGIN_CONSENT_OIDC_REQUEST_VDXF_KEY.vdxfid);
        this.chain_id = request.chain_id;
        this.signing_id = request.signing_id;
        this.signature = new __1.VerusIDSignature(request.signature, keys_1.LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY);
        this.challenge = new OidcChallenge_1.OidcChallenge(request.challenge);
    }
    getSignedData() {
        return this.challenge.toString();
    }
    toJson() {
        return {
            vdxfkey: this.vdxfkey,
            chain_id: this.chain_id,
            signing_id: this.signing_id,
            signature: this.signature.toJson(),
            challenge: this.challenge.toJson(),
        };
    }
}
exports.OidcRequest = OidcRequest;
