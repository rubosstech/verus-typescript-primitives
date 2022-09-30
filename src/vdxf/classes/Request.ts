import {
  LOGIN_CONSENT_REQUEST_VDXF_KEY,
  WALLET_VDXF_KEY,
  VDXFObject,
  VerusIDSignature,
  VerusIDSignatureInterface,
} from "../";
import { LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY } from "../keys";
import { Challenge, ChallengeInterface } from "./Challenge";
import base64url from 'base64url';
import { Hash160 } from "./Hash160";
import bufferutils from "../../utils/bufferutils";
import { HASH160_BYTE_LENGTH, I_ADDR_VERSION } from "../../constants/vdxf";
import { toBase58Check } from "../../utils/address";

export interface RequestInterface {
  system_id: string;
  signing_id: string;
  signature?: VerusIDSignatureInterface;
  challenge: ChallengeInterface;
}

export class Request extends VDXFObject {
  system_id: string;
  signing_id: string;
  signature?: VerusIDSignature;
  challenge: Challenge;

  constructor(
    request: RequestInterface = {
      system_id: "",
      signing_id: "",
      challenge: new Challenge(),
    }
  ) {
    super(LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid);

    this.system_id = request.system_id;
    this.signing_id = request.signing_id;
    this.signature = request.signature
      ? new VerusIDSignature(
          request.signature,
          LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY
        )
      : undefined;
    this.challenge = new Challenge(request.challenge);
  }

  getSignedData() {
    return this.challenge.toString();
  }

  stringable() {
    return {
      vdxfkey: this.vdxfkey,
      system_id: this.system_id,
      signing_id: this.signing_id,
      signature: this.signature ? this.signature.stringable() : this.signature,
      challenge: this.challenge.stringable(),
    };
  }

  dataByteLength(): number {
    let length = 0;
    const _system_id = Hash160.fromAddress(this.system_id);
    const _signing_id = Hash160.fromAddress(this.signing_id);
    const _signature = this.signature
      ? this.signature
      : new VerusIDSignature(
          { signature: "" },
          LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY
        );

    length += _system_id.byteLength();
    length += _signing_id.byteLength();
    length += _signature.byteLength();
    length += this.challenge.byteLength();

    return length;
  }

  toDataBuffer(): Buffer {
    const writer = new bufferutils.BufferWriter(
      Buffer.alloc(this.dataByteLength())
    );
    const _system_id = Hash160.fromAddress(this.system_id);
    const _signing_id = Hash160.fromAddress(this.signing_id);
    const _signature = this.signature
      ? this.signature
      : new VerusIDSignature(
          { signature: "" },
          LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY
        );

    writer.writeSlice(_system_id.toBuffer());

    writer.writeSlice(_signing_id.toBuffer());

    writer.writeSlice(_signature.toBuffer());

    writer.writeSlice(this.challenge.toBuffer());

    return writer.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);
    const reqLength = reader.readVarInt();

    if (reqLength == 0) {
      throw new Error("Cannot create request from empty buffer");
    } else {
      this.system_id = toBase58Check(
        reader.readSlice(HASH160_BYTE_LENGTH),
        I_ADDR_VERSION
      );
      this.signing_id = toBase58Check(
        reader.readSlice(HASH160_BYTE_LENGTH),
        I_ADDR_VERSION
      );

      const _sig = new VerusIDSignature();
      reader.offset = _sig.fromBuffer(reader.buffer, reader.offset);
      this.signature = _sig;

      const _challenge = new Challenge();
      reader.offset = _challenge.fromBuffer(reader.buffer, reader.offset);
      this.challenge = _challenge;
    }

    return reader.offset;
  }

  toWalletDeeplinkUri(): string {
    return `${WALLET_VDXF_KEY.vdxfid.toLowerCase()}://x-callback-url/${
      LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid
    }/?${LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid}=${this.toString()}`;
  }

  static fromWalletDeeplinkUri(uri: string): Request {
    const split = uri.split(`${LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid}=`);
    const req = new Request()
    req.fromBuffer(Buffer.from(split[1], 'base64url'))

    return req;
  }
}
