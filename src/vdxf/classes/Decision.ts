import { LOGIN_CONSENT_DECISION_VDXF_KEY, VDXFObject } from "..";
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
  created_at?: string;

  // General context
  context?: { [key: string]: any };
}

export class Decision extends VDXFObject {
  decision_id: string;
  context?: { [key: string]: any };
  request: Request;
  created_at: string;

  constructor(decision: DecisionInterface) {
    super(LOGIN_CONSENT_DECISION_VDXF_KEY.vdxfid)

    this.decision_id = decision.decision_id;
    this.request = new Request(decision.request);
    this.context = decision.context;
    this.created_at = decision.created_at;
  }

  toOidcDecision(): OidcDecision {
    return new OidcDecision({
      subject: this.request.challenge.subject ? JSON.stringify(this.request.challenge.subject) : undefined,
      context: this.context,
      request: new OidcRequest({
        chain_id: this.request.system_id,
        signing_id: this.request.signing_id,
        signature: this.request.signature,
        challenge: new OidcChallenge({
          uuid: this.request.challenge.challenge_id,
          requested_scope: this.request.challenge.requested_access,
          requested_access_token_audience: this.request.challenge.requested_access_audience,
          subject: this.request.challenge.subject ? JSON.stringify(this.request.challenge.subject) : undefined,
          session_id: this.request.challenge.session_id,
          client: new OidcClient({
            client_id: this.request.challenge.challenge_id,
            redirect_uris: this.request.challenge.redirect_uris ? this.request.challenge.redirect_uris.map(x => {
              return {
                type: x.vdxfkey,
                uri: x.uri
              }
            }) : undefined,
            created_at: this.request.challenge.created_at
          })
        })
      })
    })
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