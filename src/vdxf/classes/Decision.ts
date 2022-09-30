import { LOGIN_CONSENT_DECISION_VDXF_KEY, VDXFObject } from "..";
import { HASH160_BYTE_LENGTH } from "../../constants/vdxf";
import bufferutils from "../../utils/bufferutils";
import varuint from "../../utils/varuint";
import { Context } from "./Context";
import { Hash160 } from "./Hash160";
import { OidcChallenge } from "./oidc/OidcChallenge";
import { OidcClient } from "./oidc/OidcClient";
import { OidcDecision } from "./oidc/OidcDecision";
import { OidcRequest } from "./oidc/OidcRequest";
import { Request, RequestInterface } from "./Request";

export interface DecisionInterface {
  // Decision specific VDXF key
  decision_id: string;

  // Request that is 
  request: RequestInterface;

  // String of unix representation of date string
  created_at: number;

  // General context
  context?: Context;

  // List of signatures, IDs and trust score objects
  attestations?: Array<any>;
}

export class Decision extends VDXFObject {
  decision_id: string;
  context?: Context;
  request: Request;
  created_at: number;
  attestations: Array<any>;

  constructor(
    decision: DecisionInterface = {
      decision_id: "",
      request: new Request(),
      created_at: 0,
    }
  ) {
    super(LOGIN_CONSENT_DECISION_VDXF_KEY.vdxfid);

    this.decision_id = decision.decision_id;
    this.request = new Request(decision.request);
    this.context = decision.context;
    this.created_at = decision.created_at;
    this.attestations = decision.attestations;
  }

  toOidcDecision(): OidcDecision {
    return new OidcDecision({
      subject: this.request.challenge.subject
        ? JSON.stringify(this.request.challenge.subject)
        : undefined,
      context: this.context.stringable().kv,
      request: new OidcRequest({
        chain_id: this.request.system_id,
        signing_id: this.request.signing_id,
        signature: this.request.signature,
        challenge: new OidcChallenge({
          uuid: this.request.challenge.challenge_id,
          requested_scope: this.request.challenge.requested_access.map((x) =>
            x.toAddress()
          ),
          requested_access_token_audience:
            this.request.challenge.requested_access_audience,
          subject: this.request.challenge.subject
            ? JSON.stringify(this.request.challenge.subject)
            : undefined,
          session_id: this.request.challenge.session_id,
          client: new OidcClient({
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

  dataByteLength(): number {
    let length = 0;

    const _challenge_id = Hash160.fromAddress(this.decision_id, true);
    const _request = this.request ? this.request : new Request();
    const _context = this.context ? this.context : new Context();
    const _attestations = [];

    length += _challenge_id.byteLength();

    length += 8; // created_at

    length += _request.byteLength();

    length += varuint.encodingLength(_attestations.length);

    length += _context.byteLength();

    return length;
  }

  toDataBuffer(): Buffer {
    const buffer = Buffer.alloc(this.dataByteLength());
    const writer = new bufferutils.BufferWriter(buffer);

    const _decision_id = Hash160.fromAddress(this.decision_id, true);
    const _created_at = this.created_at;
    const _request = this.request ? this.request : new Request();
    const _context = this.context ? this.context : new Context();
    const _attestations = [];

    writer.writeSlice(_decision_id.toBuffer());

    writer.writeUInt64(_created_at);

    writer.writeArray(_attestations.map((x) => x.toBuffer()));

    writer.writeSlice(_request.toBuffer());

    writer.writeSlice(_context.toBuffer());

    return writer.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);
    const decisionLength = reader.readVarInt();

    if (decisionLength == 0) {
      throw new Error("Cannot create decision from empty buffer");
    } else {
      const _decision_id = new Hash160();
      reader.offset = _decision_id.fromBuffer(
        reader.buffer,
        true,
        reader.offset
      );
      this.decision_id = _decision_id.toAddress();

      this.created_at = reader.readUInt64();

      this.attestations = reader.readArray(HASH160_BYTE_LENGTH).map(() => {
        throw new Error("Attestations currently unsupported");
      });

      const _request = new Request();
      reader.offset = _request.fromBuffer(reader.buffer, reader.offset);
      this.request = _request;

      const _context = new Context();
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