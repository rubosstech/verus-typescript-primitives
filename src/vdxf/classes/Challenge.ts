import { LOGIN_CONSENT_CHALLENGE_VDXF_KEY, Utf8DataVdxfObject, VDXFObject } from "../";
import { HASH160_BYTE_LENGTH } from "../../constants/vdxf";
import bufferutils from "../../utils/bufferutils";
import varuint from "../../utils/varuint";
import { Context } from "./Context";
import { Hash160 } from "./Hash160";

export class RedirectUri extends VDXFObject {
  uri: string;

  constructor(uri: string = "", vdxfkey: string = "") {
    super(vdxfkey);

    this.uri = uri
  }

  dataByteLength(): number {
    return this.toDataBuffer().length;
  }

  toDataBuffer(): Buffer {
    return Buffer.from(this.uri, 'utf-8')
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);

    this.uri = reader.readVarSlice().toString('utf-8')

    return reader.offset
  }

  stringable() {
    return {
      uri: this.uri,
      vdxfkey: this.vdxfkey
    };
  }
}

export class Subject extends Utf8DataVdxfObject {}

export interface ChallengeInterface {
  // Challenge specific VDXF key
  challenge_id: string;

  // VDXF keys array of access requests
  requested_access?: Array<Hash160> | null;

  // Array of members that will have access to scope
  requested_access_audience?: Array<any> | null;

  // Information about the ID you have to log in with, array of VDXF objects
  subject?: Array<Subject>;

  // Array of alternate authentication factors required
  alt_auth_factors?: Array<any> | null;

  // Temporary session VDXF key
  session_id?: string;

  // List of signatures, IDs and trust score objects
  attestations?: Array<any>;

  // Array of VDXF objects defining behaviour on deeplink complete
  redirect_uris?: Array<RedirectUri>;

  // String of unix representation of date string
  created_at: number;

  // Random hash string
  salt?: string;

  // Context
  context?: Context;
}

export class Challenge extends VDXFObject implements ChallengeInterface {
  challenge_id: string;
  requested_access?: Array<Hash160> | null;
  requested_access_audience?: Array<any> | null;
  subject?: Array<Subject>;
  alt_auth_factors?: Array<any> | null;
  session_id?: string;
  attestations?: Array<any>;
  redirect_uris?: Array<RedirectUri>;
  created_at: number;
  salt?: string;
  context?: Context;

  constructor(
    challenge: ChallengeInterface = { challenge_id: "", created_at: 0 },
    vdxfid: string = LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid
  ) {
    super(vdxfid);

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
    const _alt_auth_factors = [];
    const _attestations = [];
    const _redirect_uris = this.redirect_uris ? this.redirect_uris : [];
    const _context = this.context ? this.context : new Context({});

    length += _challenge_id.byteLength();

    length += 8; // created_at

    length += _salt.byteLength();

    length += _session_id.byteLength();

    length += varuint.encodingLength(_requested_access.length);
    length += _requested_access.reduce(
      (sum, current) => sum + current.byteLength(),
      0
    );

    length += varuint.encodingLength(_requested_access_audience.length);

    length += varuint.encodingLength(_subject.length);
    length += _subject.reduce((sum, current) => sum + current.byteLength(), 0);

    length += varuint.encodingLength(_alt_auth_factors.length);

    length += varuint.encodingLength(_attestations.length);

    length += varuint.encodingLength(_redirect_uris.length);
    length += _redirect_uris.reduce(
      (sum, current) => sum + current.byteLength(),
      0
    );

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
    const _alt_auth_factors = [];
    const _attestations = [];
    const _redirect_uris = this.redirect_uris ? this.redirect_uris : [];
    const _context = this.context ? this.context : new Context({});

    writer.writeSlice(_challenge_id.toBuffer());

    writer.writeUInt64(_created_at);

    writer.writeSlice(_salt.toBuffer());

    writer.writeSlice(_session_id.toBuffer());

    writer.writeArray(_requested_access.map((x) => x.toBuffer()));

    writer.writeArray(_requested_access_audience.map((x) => x.toBuffer()));

    writer.writeArray(_subject.map((x) => x.toBuffer()));

    writer.writeArray(_alt_auth_factors.map((x) => x.toBuffer()));

    writer.writeArray(_attestations.map((x) => x.toBuffer()));

    writer.writeArray(_redirect_uris.map((x) => x.toBuffer()));

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

      const _session_id = new Hash160();
      reader.offset = _session_id.fromBuffer(
        reader.buffer,
        true,
        reader.offset
      );
      this.session_id = _session_id.toAddress();

      this.requested_access = reader.readArray(HASH160_BYTE_LENGTH).map((x) => {
        const _x = new Hash160();
        _x.fromBuffer(x);
        return _x;
      });

      this.requested_access_audience = reader
        .readArray(HASH160_BYTE_LENGTH)
        .map(() => {
          throw new Error("Requested access audience currently unsupported");
        });

      this.subject = [];
      const subjectLength = reader.readVarInt();

      for (let i = 0; i < subjectLength; i++) {
        const _subject = new Subject();
        reader.offset = _subject.fromBuffer(reader.buffer, reader.offset);
        this.subject.push(_subject);
      }

      this.alt_auth_factors = reader.readArray(HASH160_BYTE_LENGTH).map(() => {
        throw new Error("Alt auth factors currently unsupported");
      });

      this.attestations = reader.readArray(HASH160_BYTE_LENGTH).map(() => {
        throw new Error("Attestations currently unsupported");
      });

      this.redirect_uris = [];
      const urisLength = reader.readVarInt();

      for (let i = 0; i < urisLength; i++) {
        const _redirect_uri = new RedirectUri();
        reader.offset = _redirect_uri.fromBuffer(reader.buffer, reader.offset);
        this.redirect_uris.push(_redirect_uri);
      }

      const _context = new Context();
      reader.offset = _context.fromBuffer(reader.buffer, reader.offset);
      this.context = _context;
    }

    return reader.offset;
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
      context: this.context,
    };
  }
}