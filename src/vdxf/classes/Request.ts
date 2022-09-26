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

  constructor(request: RequestInterface) {
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

  toWalletDeeplinkUri(): string {
    return `${WALLET_VDXF_KEY.vdxfid.toLowerCase()}://x-callback-url/${
      LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid
    }/?${LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid}=${base64url(
      JSON.stringify(this.stringable())
    )}`;
  }

  static fromWalletDeeplinkUri(uri: string): Request {
    const split = uri.split(`${LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid}=`);
    const stringable = JSON.parse(base64url.decode(split[1]));

    return new Request(stringable)
  }
}
