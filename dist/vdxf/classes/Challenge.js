"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestedPermission = exports.BasicPermission = exports.AttestationRequest = exports.Challenge = exports.Attestation = exports.AltAuthFactor = exports.Audience = exports.ProvisioningInfo = exports.Subject = exports.RedirectUri = void 0;
const __1 = require("../");
const bufferutils_1 = require("../../utils/bufferutils");
const varuint_1 = require("../../utils/varuint");
const Context_1 = require("./Context");
const Hash160_1 = require("./Hash160");
const address_1 = require("../../utils/address");
const vdxf_1 = require("../../constants/vdxf");
class RedirectUri extends __1.VDXFObject {
    constructor(uri = "", vdxfkey = "") {
        super(vdxfkey);
        this.uri = uri;
    }
    dataByteLength() {
        return this.toDataBuffer().length;
    }
    toDataBuffer() {
        return Buffer.from(this.uri, "utf-8");
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        this.uri = reader.readVarSlice().toString("utf-8");
        return reader.offset;
    }
    toJson() {
        return {
            uri: this.uri,
            vdxfkey: this.vdxfkey,
        };
    }
}
exports.RedirectUri = RedirectUri;
class Subject extends __1.Utf8OrBase58Object {
    constructor(data = "", vdxfkey = "") {
        super(data, vdxfkey, [
            __1.ID_ADDRESS_VDXF_KEY.vdxfid,
            __1.ID_PARENT_VDXF_KEY.vdxfid,
            __1.ID_SYSTEMID_VDXF_KEY.vdxfid,
        ]);
    }
}
exports.Subject = Subject;
class ProvisioningInfo extends __1.Utf8OrBase58Object {
    constructor(data = "", vdxfkey = "") {
        super(data, vdxfkey, [
            __1.ID_ADDRESS_VDXF_KEY.vdxfid,
            __1.ID_PARENT_VDXF_KEY.vdxfid,
            __1.ID_SYSTEMID_VDXF_KEY.vdxfid,
        ]);
    }
}
exports.ProvisioningInfo = ProvisioningInfo;
class Audience extends __1.Utf8DataVdxfObject {
}
exports.Audience = Audience;
class AltAuthFactor extends __1.Utf8DataVdxfObject {
}
exports.AltAuthFactor = AltAuthFactor;
class Attestation extends __1.Utf8DataVdxfObject {
    constructor(data = "", vdxfkey = "") {
        super(data, vdxfkey);
    }
}
exports.Attestation = Attestation;
class Challenge extends __1.VDXFObject {
    constructor(challenge = { challenge_id: "", created_at: 0 }, vdxfkey = __1.LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid) {
        super(vdxfkey);
        this.challenge_id = challenge.challenge_id;
        this.requested_access = challenge.requested_access;
        this.requested_access_audience = challenge.requested_access_audience;
        this.subject = challenge.subject
            ? challenge.subject.map((x) => new Subject(x.data, x.vdxfkey))
            : challenge.subject;
        this.provisioning_info = challenge.provisioning_info
            ? challenge.provisioning_info.map((x) => new ProvisioningInfo(x.data, x.vdxfkey))
            : challenge.provisioning_info;
        this.alt_auth_factors = challenge.alt_auth_factors;
        this.session_id = challenge.session_id;
        this.attestations = challenge.attestations ? challenge.attestations.map((x) => new Attestation(x.data, x.vdxfkey)) : challenge.attestations;
        this.redirect_uris = challenge.redirect_uris
            ? challenge.redirect_uris.map((x) => new RedirectUri(x.uri, x.vdxfkey))
            : challenge.redirect_uris;
        this.created_at = challenge.created_at;
        this.salt = challenge.salt;
        this.context = challenge.context
            ? new Context_1.Context(challenge.context.kv)
            : challenge.context;
        this.skip = challenge.skip ? true : false;
    }
    dataByteLength() {
        let length = 0;
        const _challenge_id = Hash160_1.Hash160.fromAddress(this.challenge_id, true);
        const _created_at = this.created_at;
        const _salt = this.salt
            ? Hash160_1.Hash160.fromAddress(this.salt, true)
            : Hash160_1.Hash160.getEmpty();
        const _session_id = this.session_id
            ? Hash160_1.Hash160.fromAddress(this.session_id, true)
            : Hash160_1.Hash160.getEmpty();
        const _requested_access = this.requested_access
            ? this.requested_access
            : [];
        const _requested_access_audience = [];
        const _subject = this.subject ? this.subject : [];
        const _provisioning_info = this.provisioning_info ? this.provisioning_info : [];
        const _alt_auth_factors = [];
        const _attestations = this.attestations ? this.attestations : [];
        const _redirect_uris = this.redirect_uris ? this.redirect_uris : [];
        const _context = this.context ? this.context : new Context_1.Context({});
        length += _challenge_id.byteLength();
        length += 8; // created_at
        length += _salt.byteLength();
        if (this.vdxfkey === __1.LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid) {
            length += 1; // skip
            length += _session_id.byteLength();
            length += varuint_1.default.encodingLength(_requested_access.length);
            length += _requested_access.reduce((sum, current) => sum + current.byteLength(), 0);
            length += varuint_1.default.encodingLength(_requested_access_audience.length);
            length += varuint_1.default.encodingLength(_subject.length);
            length += _subject.reduce((sum, current) => sum + current.byteLength(), 0);
            length += varuint_1.default.encodingLength(_provisioning_info.length);
            length += _provisioning_info.reduce((sum, current) => sum + current.byteLength(), 0);
            length += varuint_1.default.encodingLength(_alt_auth_factors.length);
            length += varuint_1.default.encodingLength(_attestations.length);
            length += _attestations.reduce((sum, current) => sum + current.byteLength(), 0);
            length += varuint_1.default.encodingLength(_redirect_uris.length);
            length += _redirect_uris.reduce((sum, current) => sum + current.byteLength(), 0);
        }
        length += _context.byteLength();
        return length;
    }
    toDataBuffer() {
        const buffer = Buffer.alloc(this.dataByteLength());
        const writer = new bufferutils_1.default.BufferWriter(buffer);
        const _challenge_id = Hash160_1.Hash160.fromAddress(this.challenge_id, true);
        const _created_at = this.created_at;
        const _salt = this.salt
            ? Hash160_1.Hash160.fromAddress(this.salt, true)
            : Hash160_1.Hash160.getEmpty();
        const _session_id = this.session_id
            ? Hash160_1.Hash160.fromAddress(this.session_id, true)
            : Hash160_1.Hash160.getEmpty();
        const _requested_access = this.requested_access
            ? this.requested_access
            : [];
        const _requested_access_audience = [];
        const _subject = this.subject ? this.subject : [];
        const _provisioning_info = this.provisioning_info ? this.provisioning_info : [];
        const _alt_auth_factors = [];
        const _attestations = this.attestations ? this.attestations : [];
        const _redirect_uris = this.redirect_uris ? this.redirect_uris : [];
        const _context = this.context ? this.context : new Context_1.Context({});
        writer.writeSlice(_challenge_id.toBuffer());
        writer.writeUInt64(_created_at);
        writer.writeSlice(_salt.toBuffer());
        if (this.vdxfkey === __1.LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid) {
            writer.writeUInt8(this.skip ? 1 : 0);
            writer.writeSlice(_session_id.toBuffer());
            writer.writeArray(_requested_access.map((x) => x.toBuffer()));
            writer.writeArray(_requested_access_audience.map((x) => x.toBuffer()));
            writer.writeArray(_subject.map((x) => x.toBuffer()));
            writer.writeArray(_provisioning_info.map((x) => x.toBuffer()));
            writer.writeArray(_alt_auth_factors.map((x) => x.toBuffer()));
            writer.writeArray(_attestations.map((x) => x.toBuffer()));
            writer.writeArray(_redirect_uris.map((x) => x.toBuffer()));
        }
        writer.writeSlice(_context.toBuffer());
        return writer.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const challengeLength = reader.readVarInt();
        if (challengeLength == 0) {
            throw new Error("Cannot create challenge from empty buffer");
        }
        else {
            const _challenge_id = new Hash160_1.Hash160();
            reader.offset = _challenge_id.fromBuffer(reader.buffer, true, reader.offset);
            this.challenge_id = _challenge_id.toAddress();
            this.created_at = reader.readUInt64();
            const _salt = new Hash160_1.Hash160();
            reader.offset = _salt.fromBuffer(reader.buffer, true, reader.offset);
            this.salt = _salt.toAddress();
            if (this.vdxfkey === __1.LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid) {
                this.skip = reader.readUInt8() === 1 ? true : false;
                const _session_id = new Hash160_1.Hash160();
                reader.offset = _session_id.fromBuffer(reader.buffer, true, reader.offset);
                this.session_id = _session_id.toAddress();
                this.requested_access = [];
                const requestedAccessLength = reader.readVarInt();
                for (let i = 0; i < requestedAccessLength; i++) {
                    const _perm = new RequestedPermission();
                    reader.offset = _perm.fromBuffer(reader.buffer, reader.offset);
                    this.requested_access.push(_perm);
                }
                this.requested_access_audience = [];
                const audienceLength = reader.readVarInt();
                if (audienceLength > 0) {
                    throw new Error("Requested access audience currently unsupported");
                }
                this.subject = [];
                const subjectLength = reader.readVarInt();
                for (let i = 0; i < subjectLength; i++) {
                    const _subject = new Subject();
                    reader.offset = _subject.fromBuffer(reader.buffer, reader.offset);
                    this.subject.push(_subject);
                }
                this.provisioning_info = [];
                const provisioningInfoLength = reader.readVarInt();
                for (let i = 0; i < provisioningInfoLength; i++) {
                    const _provisioning_info = new ProvisioningInfo();
                    reader.offset = _provisioning_info.fromBuffer(reader.buffer, reader.offset);
                    this.provisioning_info.push(_provisioning_info);
                }
                this.alt_auth_factors = [];
                const altAuthFactorLength = reader.readVarInt();
                if (altAuthFactorLength > 0) {
                    throw new Error("Alt auth factors currently unsupported");
                }
                this.attestations = [];
                const attestationsLength = reader.readVarInt();
                for (let i = 0; i < attestationsLength; i++) {
                    const _att = new Attestation();
                    reader.offset = _att.fromBuffer(reader.buffer, reader.offset);
                    this.attestations.push(_att);
                }
                this.redirect_uris = [];
                const urisLength = reader.readVarInt();
                for (let i = 0; i < urisLength; i++) {
                    const _redirect_uri = new RedirectUri();
                    reader.offset = _redirect_uri.fromBuffer(reader.buffer, reader.offset);
                    this.redirect_uris.push(_redirect_uri);
                }
            }
            const _context = new Context_1.Context();
            reader.offset = _context.fromBuffer(reader.buffer, reader.offset);
            this.context = _context;
        }
        return reader.offset;
    }
    toJson() {
        return {
            vdxfkey: this.vdxfkey,
            challenge_id: this.challenge_id,
            requested_access: this.requested_access,
            requested_access_audience: this.requested_access_audience,
            subject: this.subject,
            provisioning_info: this.provisioning_info,
            alt_auth_factors: this.alt_auth_factors,
            session_id: this.session_id,
            attestations: this.attestations,
            redirect_uris: this.redirect_uris
                ? this.redirect_uris.map((x) => x.toJson())
                : this.redirect_uris,
            created_at: this.created_at,
            salt: this.salt,
            context: this.context,
            skip: this.skip,
        };
    }
}
exports.Challenge = Challenge;
class AttestationRequest extends __1.VDXFObject {
    constructor(vdxfkey = "", data) {
        super(vdxfkey);
        for (let key in data) {
            this[key] = data[key];
        }
    }
    dataByteLength() {
        let length = 0;
        for (const item of Object.getOwnPropertyNames(this)) {
            if ((item !== "version") && (item !== "vdxfkey")) {
                length += varuint_1.default.encodingLength(this[item].length);
                if (this[item].length > 0) {
                    length += this[item].reduce((sum, current) => sum + (0, address_1.fromBase58Check)(current).hash.byteLength, 0);
                }
            }
        }
        return length;
    }
    toDataBuffer() {
        const writer = new bufferutils_1.default.BufferWriter(Buffer.alloc(this.dataByteLength()));
        for (const item of Object.getOwnPropertyNames(this)) {
            if ((item !== "version") && (item !== "vdxfkey")) {
                writer.writeArray(this[item].map((x) => (0, address_1.fromBase58Check)(x).hash));
            }
        }
        return writer.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        for (const item of Object.getOwnPropertyNames(this)) {
            if ((item !== "version") && (item !== "vdxfkey")) {
                const arrayLength = reader.readVarInt();
                for (let i = 0; i < arrayLength; i++) {
                    this[item].push((0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION));
                }
                if (offset < buffer.length - 1) {
                    reader.offset = this.fromDataBuffer(reader.buffer, reader.offset);
                }
            }
        }
        return reader.offset;
    }
    toJson() {
        return {
            vdxfkey: this.vdxfkey,
            acceptedattestors: this.acceptedattestors,
            attestationkeys: this.attestationkeys,
            attestorfilters: this.attestorfilters,
        };
    }
}
exports.AttestationRequest = AttestationRequest;
class BasicPermission extends __1.Utf8DataVdxfObject {
    constructor(data = "", vdxfkey = "") {
        super(data, vdxfkey);
    }
}
exports.BasicPermission = BasicPermission;
class RequestedPermission extends __1.VDXFObject {
    constructor(vdxfkey = "", data = "") {
        super(vdxfkey);
        switch (vdxfkey) {
            case __1.IDENTITY_DATA_REQUEST.vdxfid:
                return new AttestationRequest(vdxfkey, data);
            case __1.IDENTITY_VIEW.vdxfid:
                return new BasicPermission(vdxfkey);
            case __1.IDENTITY_AGREEMENT.vdxfid:
                return new BasicPermission(vdxfkey);
            default:
                throw new Error(`Invalid type: ${vdxfkey}`);
        }
    }
}
exports.RequestedPermission = RequestedPermission;
