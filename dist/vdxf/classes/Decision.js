"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decision = void 0;
const __1 = require("..");
const vdxf_1 = require("../../constants/vdxf");
const bufferutils_1 = require("../../utils/bufferutils");
const varuint_1 = require("../../utils/varuint");
const Context_1 = require("./Context");
const Hash160_1 = require("./Hash160");
const OidcChallenge_1 = require("./oidc/OidcChallenge");
const OidcClient_1 = require("./oidc/OidcClient");
const OidcDecision_1 = require("./oidc/OidcDecision");
const OidcRequest_1 = require("./oidc/OidcRequest");
const Request_1 = require("./Request");
class Decision extends __1.VDXFObject {
    constructor(decision = {
        decision_id: "",
        request: new Request_1.Request(),
        created_at: 0,
    }) {
        super(__1.LOGIN_CONSENT_DECISION_VDXF_KEY.vdxfid);
        this.decision_id = decision.decision_id;
        this.request = new Request_1.Request(decision.request);
        this.context = decision.context;
        this.created_at = decision.created_at;
        this.attestations = decision.attestations;
    }
    toOidcDecision() {
        return new OidcDecision_1.OidcDecision({
            subject: this.request.challenge.subject
                ? JSON.stringify(this.request.challenge.subject)
                : undefined,
            context: this.context.stringable().kv,
            request: new OidcRequest_1.OidcRequest({
                chain_id: this.request.system_id,
                signing_id: this.request.signing_id,
                signature: this.request.signature,
                challenge: new OidcChallenge_1.OidcChallenge({
                    uuid: this.request.challenge.challenge_id,
                    requested_scope: this.request.challenge.requested_access.map((x) => x.toAddress()),
                    requested_access_token_audience: this.request.challenge.requested_access_audience,
                    subject: this.request.challenge.subject
                        ? JSON.stringify(this.request.challenge.subject)
                        : undefined,
                    session_id: this.request.challenge.session_id,
                    client: new OidcClient_1.OidcClient({
                        client_id: this.request.challenge.challenge_id,
                        redirect_uris: this.request.challenge.redirect_uris
                            ? this.request.challenge.redirect_uris.map((x) => {
                                return {
                                    type: x.vdxfkey,
                                    uri: x.uri,
                                };
                            })
                            : undefined,
                        created_at: this.request.challenge.created_at.toString(),
                    }),
                }),
            }),
        });
    }
    dataByteLength() {
        let length = 0;
        const _challenge_id = Hash160_1.Hash160.fromAddress(this.decision_id, true);
        const _request = this.request ? this.request : new Request_1.Request();
        const _context = this.context ? this.context : new Context_1.Context();
        const _attestations = [];
        length += _challenge_id.byteLength();
        length += 8; // created_at
        length += _request.byteLength();
        length += varuint_1.default.encodingLength(_attestations.length);
        length += _context.byteLength();
        return length;
    }
    toDataBuffer() {
        const buffer = Buffer.alloc(this.dataByteLength());
        const writer = new bufferutils_1.default.BufferWriter(buffer);
        const _decision_id = Hash160_1.Hash160.fromAddress(this.decision_id, true);
        const _created_at = this.created_at;
        const _request = this.request ? this.request : new Request_1.Request();
        const _context = this.context ? this.context : new Context_1.Context();
        const _attestations = [];
        writer.writeSlice(_decision_id.toBuffer());
        writer.writeUInt64(_created_at);
        writer.writeArray(_attestations.map((x) => x.toBuffer()));
        writer.writeSlice(_request.toBuffer());
        writer.writeSlice(_context.toBuffer());
        return writer.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const decisionLength = reader.readVarInt();
        if (decisionLength == 0) {
            throw new Error("Cannot create decision from empty buffer");
        }
        else {
            const _decision_id = new Hash160_1.Hash160();
            reader.offset = _decision_id.fromBuffer(reader.buffer, true, reader.offset);
            this.decision_id = _decision_id.toAddress();
            this.created_at = reader.readUInt64();
            this.attestations = reader.readArray(vdxf_1.HASH160_BYTE_LENGTH).map(() => {
                throw new Error("Attestations currently unsupported");
            });
            const _request = new Request_1.Request();
            reader.offset = _request.fromBuffer(reader.buffer, reader.offset);
            this.request = _request;
            const _context = new Context_1.Context();
            reader.offset = _context.fromBuffer(reader.buffer, reader.offset);
            this.context = _context;
        }
        return reader.offset;
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
