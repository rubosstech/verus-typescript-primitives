"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge = exports.Subject = exports.RedirectUri = void 0;
const __1 = require("../");
class RedirectUri extends __1.VDXFObject {
    constructor(uri, vdxfkey) {
        super(vdxfkey);
        this.uri = uri;
    }
    stringable() {
        return {
            uri: this.uri,
            vdxfkey: this.vdxfkey
        };
    }
}
exports.RedirectUri = RedirectUri;
class Subject extends __1.VDXFObject {
    constructor(data, vdxfkey) {
        super(vdxfkey);
        this.data = data;
    }
    stringable() {
        return {
            data: this.data,
            vdxfkey: this.vdxfkey
        };
    }
}
exports.Subject = Subject;
class Challenge extends __1.VDXFObject {
    constructor(challenge) {
        super(__1.LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid);
        this.challenge_id = challenge.challenge_id;
        this.requested_access = challenge.requested_access;
        this.requested_access_audience = challenge.requested_access_audience;
        this.subject = challenge.subject;
        this.alt_auth_factors = challenge.alt_auth_factors;
        this.session_id = challenge.session_id;
        this.attestations = challenge.attestations;
        this.redirect_uris = challenge.redirect_uris
            ? challenge.redirect_uris.map((x) => new RedirectUri(x.uri, x.vdxfkey))
            : challenge.redirect_uris;
        this.created_at = challenge.created_at;
        this.salt = challenge.salt;
        this.context = challenge.context;
    }
    stringable() {
        return {
            vdxfkey: this.vdxfkey,
            challenge_id: this.challenge_id,
            requested_access: this.requested_access,
            requested_access_audience: this.requested_access_audience,
            subject: this.subject,
            alt_auth_factors: this.alt_auth_factors,
            session_id: this.session_id,
            attestations: this.attestations,
            redirect_uris: this.redirect_uris
                ? this.redirect_uris.map((x) => x.stringable())
                : this.redirect_uris,
            created_at: this.created_at,
            salt: this.salt,
            context: this.context
        };
    }
}
exports.Challenge = Challenge;
