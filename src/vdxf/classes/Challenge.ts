import { Client, ClientInterface } from "./Client";
import { LOGIN_CONSENT_CHALLENGE_VDXF_KEY, VDXFObject } from "../";

export interface ChallengeInterface {
  uuid: string;
  requested_scope?: Array<string> | null;
  requested_access_token_audience?: Array<string> | null;
  skip?: boolean;
  subject?: string;
  oidc_context?:
    | {
        acr_values: Array<string>;
        display: string;
        id_token_hint_claims: { [key: string]: any };
        login_hint: string;
        ui_locales: Array<string>;
      }
    | {};
  request_url?: string;
  login_challenge?: string;
  login_session_id?: string;
  acr?: string;
  session_id?: string;
  client: ClientInterface;
}

export class Challenge extends VDXFObject {
  uuid: string = "";
  client: Client;
  requested_scope?: Array<string> | null;
  requested_access_token_audience?: Array<string> | null;
  skip?: boolean;
  subject?: string;
  oidc_context?:
    | {
        acr_values: Array<string>;
        display: string;
        id_token_hint_claims: { [key: string]: any };
        login_hint: string;
        ui_locales: Array<string>;
      }
    | {};
  request_url?: string;
  login_challenge?: string;
  login_session_id?: string;
  acr?: string;
  session_id?: string;

  constructor(challenge: ChallengeInterface) {
    super(LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid)

    this.uuid = challenge.uuid;
    this.requested_scope = challenge.requested_scope;
    this.requested_access_token_audience = challenge.requested_access_token_audience;
    this.skip = challenge.skip;
    this.subject = challenge.subject;
    this.oidc_context = challenge.oidc_context;
    this.request_url = challenge.request_url;
    this.login_challenge = challenge.login_challenge;
    this.login_session_id = challenge.login_session_id;
    this.acr = challenge.acr;
    this.session_id = challenge.session_id;
    this.client = new Client(challenge.client);
  }

  stringable() {
    return {
      vdxfkey: this.vdxfkey,
      uuid: this.uuid,
      client: this.client.stringable(),
      requested_scope: this.requested_scope,
      requested_access_token_audience: this.requested_access_token_audience,
      skip: this.skip,
      subject: this.subject,
      oidc_context: this.oidc_context,
      request_url: this.request_url,
      login_challenge: this.login_challenge,
      login_session_id: this.login_session_id,
      acr: this.acr,
      session_id: this.session_id,
    };
  }
}