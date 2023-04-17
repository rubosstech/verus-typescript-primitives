import {
  LOGIN_CONSENT_CHALLENGE_VDXF_KEY,
  ID_ADDRESS_VDXF_KEY,
  ID_PARENT_VDXF_KEY,
  ID_SYSTEMID_VDXF_KEY,
  Utf8DataVdxfObject,
  VDXFObject,
  Utf8OrBase58Object,
  IDENTITY_DATA_REQUEST,
  IDENTITY_VIEW,
  IDENTITY_AGREEMENT,
} from "../";
import bufferutils from "../../utils/bufferutils";
import varuint from "../../utils/varuint";
import { Context } from "./Context";
import { Hash160 } from "./Hash160";
import { fromBase58Check, toBase58Check } from '../../utils/address';
import { DEFAULT_VERSION, HASH160_BYTE_LENGTH, I_ADDR_VERSION } from '../../constants/vdxf';
export class RedirectUri extends VDXFObject {
  uri: string;

  constructor(uri: string = "", vdxfkey: string = "") {
    super(vdxfkey);

    this.uri = uri;
  }

  dataByteLength(): number {
    return this.toDataBuffer().length;
  }

  toDataBuffer(): Buffer {
    return Buffer.from(this.uri, "utf-8");
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);

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

export class Subject extends Utf8OrBase58Object {
  constructor(data: string = "", vdxfkey: string = "") {
    super(data, vdxfkey, [
      ID_ADDRESS_VDXF_KEY.vdxfid,
      ID_PARENT_VDXF_KEY.vdxfid,
      ID_SYSTEMID_VDXF_KEY.vdxfid,
    ]);
  }
}

export class ProvisioningInfo extends Utf8OrBase58Object {
  constructor(data: string = "", vdxfkey: string = "") {
    super(data, vdxfkey, [
      ID_ADDRESS_VDXF_KEY.vdxfid,
      ID_PARENT_VDXF_KEY.vdxfid,
      ID_SYSTEMID_VDXF_KEY.vdxfid,
    ]);
  }
}

export class Audience extends Utf8DataVdxfObject { }

export class AltAuthFactor extends Utf8DataVdxfObject { }

export class Attestation extends Utf8DataVdxfObject {
  constructor(data: string = "", vdxfkey: string = "") {
    super(data, vdxfkey);
  }
}

export interface ChallengeInterface {
  // Challenge specific VDXF key
  challenge_id: string;

  // VDXF keys array of access requests
  requested_access?: Array<RequestedPermission> | null;

  // Array of members that will have access to scope
  requested_access_audience?: Array<Audience> | null;

  // Information about the ID you have to log in with, array of VDXF objects
  subject?: Array<Subject>;

  // Information about the provisioning endpoint and ID possibilities, can contain 
  // a webhook, and info regarding what ID will be provisioned to the user if they make a 
  // provisioning request.
  provisioning_info?: Array<ProvisioningInfo>

  // Array of alternate authentication factors required
  alt_auth_factors?: Array<AltAuthFactor> | null;

  // Temporary session VDXF key
  session_id?: string;

  // List of signatures, IDs and trust score objects
  attestations?: Array<Attestation>;

  // Array of VDXF objects defining behaviour on deeplink complete
  redirect_uris?: Array<RedirectUri>;

  // String of unix representation of date string
  created_at: number;

  // Boolean denoting whether or not to attempt to skip over UI based on
  // the user's decision to remember their login (will still be verified by the wallet)
  skip?: boolean;

  // Random hash string
  salt?: string;

  // Context
  context?: Context;
}

export class Challenge extends VDXFObject implements ChallengeInterface {
  challenge_id: string;
  requested_access?: Array<RequestedPermission> | null;
  requested_access_audience?: Array<Audience> | null;
  subject?: Array<Subject>;
  provisioning_info?: Array<ProvisioningInfo>;
  alt_auth_factors?: Array<AltAuthFactor> | null;
  session_id?: string;
  attestations?: Array<Attestation>;
  redirect_uris?: Array<RedirectUri>;
  created_at: number;
  skip?: boolean;
  salt?: string;
  context?: Context;

  constructor(
    challenge: ChallengeInterface = { challenge_id: "", created_at: 0 },
    vdxfkey: string = LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid
  ) {
    super(vdxfkey);

    this.challenge_id = challenge.challenge_id;
    this.requested_access = challenge.requested_access ? challenge.requested_access.map((x) => new RequestedPermission(x.data, x.vdxfkey)) : challenge.requested_access;
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
      ? new Context(challenge.context.kv)
      : challenge.context;
    this.skip = challenge.skip ? true : false;
  }

  dataByteLength(): number {
    let length = 0;

    const _challenge_id = Hash160.fromAddress(this.challenge_id, true);
    const _created_at = this.created_at;
    const _salt = this.salt
      ? Hash160.fromAddress(this.salt, true)
      : Hash160.getEmpty();
    const _session_id = this.session_id
      ? Hash160.fromAddress(this.session_id, true)
      : Hash160.getEmpty();
    const _requested_access = this.requested_access
      ? this.requested_access
      : [];
    const _requested_access_audience = [];
    const _subject = this.subject ? this.subject : [];
    const _provisioning_info = this.provisioning_info ? this.provisioning_info : [];
    const _alt_auth_factors = [];
    const _attestations = this.attestations ? this.attestations : [];
    const _redirect_uris = this.redirect_uris ? this.redirect_uris : [];
    const _context = this.context ? this.context : new Context({});

    length += _challenge_id.byteLength();

    length += 8; // created_at

    length += _salt.byteLength();

    if (this.vdxfkey === LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid) {
      length += 1; // skip

      length += _session_id.byteLength();

      length += varuint.encodingLength(_requested_access.length);
      length += _requested_access.reduce(
        (sum, current) => sum + current.byteLength(),
        0
      );

      length += varuint.encodingLength(_requested_access_audience.length);

      length += varuint.encodingLength(_subject.length);
      length += _subject.reduce(
        (sum, current) => sum + current.byteLength(),
        0
      );

      length += varuint.encodingLength(_provisioning_info.length);
      length += _provisioning_info.reduce(
        (sum, current) => sum + current.byteLength(),
        0
      );

      length += varuint.encodingLength(_alt_auth_factors.length);

      length += varuint.encodingLength(_attestations.length);
      length += _attestations.reduce(
        (sum, current) => sum + current.byteLength(),
        0
      );

      length += varuint.encodingLength(_redirect_uris.length);
      length += _redirect_uris.reduce(
        (sum, current) => sum + current.byteLength(),
        0
      );
    }

    length += _context.byteLength();

    return length;
  }

  toDataBuffer(): Buffer {
    const buffer = Buffer.alloc(this.dataByteLength());
    const writer = new bufferutils.BufferWriter(buffer);

    const _challenge_id = Hash160.fromAddress(this.challenge_id, true);
    const _created_at = this.created_at;
    const _salt = this.salt
      ? Hash160.fromAddress(this.salt, true)
      : Hash160.getEmpty();
    const _session_id = this.session_id
      ? Hash160.fromAddress(this.session_id, true)
      : Hash160.getEmpty();
    const _requested_access = this.requested_access
      ? this.requested_access
      : [];
    const _requested_access_audience = [];
    const _subject = this.subject ? this.subject : [];
    const _provisioning_info = this.provisioning_info ? this.provisioning_info : [];
    const _alt_auth_factors = [];
    const _attestations = this.attestations ? this.attestations : [];
    const _redirect_uris = this.redirect_uris ? this.redirect_uris : [];
    const _context = this.context ? this.context : new Context({});

    writer.writeSlice(_challenge_id.toBuffer());

    writer.writeUInt64(_created_at);

    writer.writeSlice(_salt.toBuffer());

    if (this.vdxfkey === LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid) {
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

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);
    const challengeLength = reader.readVarInt();

    if (challengeLength == 0) {
      throw new Error("Cannot create challenge from empty buffer");
    } else {
      const _challenge_id = new Hash160();
      reader.offset = _challenge_id.fromBuffer(
        reader.buffer,
        true,
        reader.offset
      );
      this.challenge_id = _challenge_id.toAddress();

      this.created_at = reader.readUInt64();

      const _salt = new Hash160();
      reader.offset = _salt.fromBuffer(reader.buffer, true, reader.offset);
      this.salt = _salt.toAddress();

      if (this.vdxfkey === LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid) {
        this.skip = reader.readUInt8() === 1 ? true : false;

        const _session_id = new Hash160();
        reader.offset = _session_id.fromBuffer(
          reader.buffer,
          true,
          reader.offset
        );
        this.session_id = _session_id.toAddress();

        this.requested_access = [];
        const requestedAccessLength = reader.readVarInt();

        for (let i = 0; i < requestedAccessLength; i++) {

          const _vdxfkey = toBase58Check(reader.buffer.slice(reader.offset, 
                                                             reader.offset + HASH160_BYTE_LENGTH), 
                                                             I_ADDR_VERSION);
          const _perm = new RequestedPermission({}, _vdxfkey);
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
          reader.offset = _redirect_uri.fromBuffer(
            reader.buffer,
            reader.offset
          );
          this.redirect_uris.push(_redirect_uri);
        }
      }

      const _context = new Context();
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

export class AttestationRequest extends VDXFObject {
  data: {
    accepted_attestors?: Array<Hash160>,
    attestation_keys?: Array<Hash160>,
    attestor_filters?: Array<Hash160>
  }

  private readonly classMembers: string[];

  dataByteLength(): number {

    let length = 0;
    for (const item of this.classMembers) {
      length += varuint.encodingLength(this.data[item].length);
      if (this.data[item].length > 0) {
        length += this.data[item].reduce(
          (sum, current) => sum + current.byteLength(),
          0
        );
      }
    }
    return length;
  }

  toDataBuffer(): Buffer {

    const writer = new bufferutils.BufferWriter(Buffer.alloc(this.dataByteLength()))
    for (const item of this.classMembers) {
      writer.writeArray(this.data[item].map((x) => x.toBuffer()));
    }
    return writer.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new bufferutils.BufferReader(buffer, offset);
    const datalength = reader.readVarInt();
    if (datalength > 0) {
      for (const item of this.classMembers) {
        const arrayLength = reader.readVarInt();
        for (let i = 0; i < arrayLength; i++) {
          const member = new Hash160();
          reader.offset = member.fromBuffer(reader.buffer, false, reader.offset)
          this.data[item].push(member.hash);
        }
      }
    }
    return reader.offset;
  }

  toJson() {

    return {
      vdxfkey: this.vdxfkey,
      data: {
        accepted_attestors: this.data.accepted_attestors ? this.data.accepted_attestors.map((x) => x.toAddress()) : [],
        attestation_keys: this.data.attestation_keys ? this.data.attestation_keys.map((x) => x.toAddress()) : [],
        attestor_filters: this.data.attestor_filters ? this.data.attestor_filters.map((x) => x.toAddress()) : []
      }
    }
  }

}

export class RequestedPermission extends VDXFObject {
  data: object;
  private classMembers: string[];

  constructor(data: object = {}, vdxfkey: string = "") {
    super(vdxfkey);
    this.data = data;
    this.addPrototypes(data);
  }

  private addPrototypes(dataIn: any): void {
    const prototypes = ['dataByteLength', 'toDataBuffer', 'fromDataBuffer', 'toJson'];

    switch (this.vdxfkey) {
      case IDENTITY_DATA_REQUEST.vdxfid:
        prototypes.forEach(name => {
          Object.defineProperty(this, name, Object.getOwnPropertyDescriptor(AttestationRequest.prototype, name));
        });
        this.classMembers = ['accepted_attestors', 'attestation_keys', 'attestor_filters'];
        for (let key of this.classMembers) {
          this.data[key] = dataIn[key]
            ? dataIn[key].map((x) => Hash160.fromAddress(x))
            : [];
        }
        break;
      case IDENTITY_VIEW.vdxfid:
        break;
      case IDENTITY_AGREEMENT.vdxfid:
        prototypes.forEach(name => {
          Object.defineProperty(this, name, Object.getOwnPropertyDescriptor(Utf8DataVdxfObject.prototype, name));
        });
        this.classMembers = ['title', 'description'];
        for (let key of this.classMembers) {
          this.data[key] = dataIn[key]
            ? dataIn[key]
            : "";
        }
        break;
      default:
        break;
    }
  }
}
