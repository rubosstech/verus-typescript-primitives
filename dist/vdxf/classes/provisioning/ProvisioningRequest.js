"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisioningRequest = void 0;
const createHash = require("create-hash");
const __1 = require("../../");
const vdxf_1 = require("../../../constants/vdxf");
const address_1 = require("../../../utils/address");
const Request_1 = require("../Request");
const ProvisioningChallenge_1 = require("./ProvisioningChallenge");
class ProvisioningRequest extends Request_1.Request {
    constructor(request = {
        signing_address: "",
        challenge: new ProvisioningChallenge_1.ProvisioningChallenge(),
    }) {
        super({
            system_id: null,
            signing_id: null,
            challenge: request.challenge,
            signature: request.signature,
        }, __1.LOGIN_CONSENT_PROVISIONING_REQUEST_VDXF_KEY.vdxfid);
        this.challenge = new ProvisioningChallenge_1.ProvisioningChallenge(request.challenge);
        this.signing_address = request.signing_address;
    }
    stringable() {
        return {
            vdxfkey: this.vdxfkey,
            system_id: null,
            signing_address: this.signing_address,
            signing_id: null,
            signature: this.signature ? this.signature.stringable() : this.signature,
            challenge: this.challenge.stringable(),
        };
    }
    getChallengeHash() {
        return createHash("sha256")
            .update(vdxf_1.VERUS_DATA_SIGNATURE_PREFIX)
            .update((0, address_1.fromBase58Check)(this.signing_address).hash)
            .update(this.challenge.toBuffer())
            .digest();
    }
    dataByteLength() {
        const length = this._dataByteLength(this.signing_address);
        return length;
    }
    toDataBuffer() {
        const buffer = this._toDataBuffer(this.signing_address);
        return buffer;
    }
    fromDataBuffer(buffer, offset) {
        let _offset = this._fromDataBuffer(buffer, offset);
        this.challenge = new ProvisioningChallenge_1.ProvisioningChallenge();
        _offset = this.challenge.fromBuffer(buffer, _offset);
        this.signing_address = this.signing_id;
        this.signing_id = null;
        return _offset;
    }
    toWalletDeeplinkUri() {
        throw new Error("Cannot create deeplink from provisioning request");
    }
    static fromWalletDeeplinkUri(uri) {
        throw new Error("Cannot create provisioning request from deeplink");
    }
}
exports.ProvisioningRequest = ProvisioningRequest;
