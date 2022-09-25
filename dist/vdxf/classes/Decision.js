"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decision = void 0;
const __1 = require("..");
const OidcChallenge_1 = require("./oidc/OidcChallenge");
const OidcClient_1 = require("./oidc/OidcClient");
const OidcDecision_1 = require("./oidc/OidcDecision");
const OidcRequest_1 = require("./oidc/OidcRequest");
const Request_1 = require("./Request");
class Decision extends __1.VDXFObject {
    constructor(decision) {
        super(__1.LOGIN_CONSENT_DECISION_VDXF_KEY.vdxfid);
        this.decision_id = decision.decision_id;
        this.request = new Request_1.Request(decision.request);
        this.context = decision.context;
        this.created_at = decision.created_at;
    }
    toOidcDecision() {
        return new OidcDecision_1.OidcDecision({
            subject: this.request.challenge.subject ? JSON.stringify(this.request.challenge.subject) : undefined,
            context: this.context,
            request: new OidcRequest_1.OidcRequest({
                chain_id: this.request.chain_id,
                signing_id: this.request.signing_id,
                signature: this.request.signature,
                challenge: new OidcChallenge_1.OidcChallenge({
                    uuid: this.request.challenge.challenge_id,
                    requested_scope: this.request.challenge.requested_access,
                    requested_access_token_audience: this.request.challenge.requested_access_audience,
                    subject: this.request.challenge.subject ? JSON.stringify(this.request.challenge.subject) : undefined,
                    session_id: this.request.challenge.session_id,
                    client: new OidcClient_1.OidcClient({
                        client_id: this.request.challenge.challenge_id,
                        redirect_uris: this.request.challenge.redirect_uris ? this.request.challenge.redirect_uris.map(x => {
                            return {
                                type: x.vdxfkey,
                                uri: x.uri
                            };
                        }) : undefined,
                        created_at: this.request.challenge.created_at
                    })
                })
            })
        });
    }
    stringable() {
        return {
            vdxfkey: this.vdxfkey,
            decision_id: this.decision_id,
            context: this.context,
            created_at: this.created_at,
            request: this.request.stringable(),
        };
    }
}
exports.Decision = Decision;
