import { Decision, DecisionInterface } from "./Decision";
import { LOGIN_CONSENT_RESPONSE_VDXF_KEY, VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../";
import { LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY } from "../keys";

interface ResponseInterface {
  system_id: string;
  signing_id: string;
  signature?: VerusIDSignatureInterface;
  decision: DecisionInterface;
}

export class Response extends VDXFObject {
  system_id: string;
  signing_id: string;
  signature?: VerusIDSignature;
  decision: Decision;

  constructor(response: ResponseInterface) {
    super(LOGIN_CONSENT_RESPONSE_VDXF_KEY.vdxfid)
    
    this.system_id = response.system_id;
    this.signing_id = response.signing_id;
    this.decision = new Decision(response.decision);

    if (response.signature) {
      this.signature = new VerusIDSignature(
        response.signature,
        LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY
      );
    }
  }

  getSignedData() {
    return this.decision.toString()
  }

  stringable() {
    return {
      vdxfkey: this.vdxfkey,
      system_id: this.system_id,
      signature: this.signature,
      signing_id: this.signing_id,
      decision: this.decision.stringable()
    }
  }
}