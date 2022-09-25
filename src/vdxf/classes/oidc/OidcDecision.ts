import { LOGIN_CONSENT_OIDC_DECISION_VDXF_KEY, VDXFObject } from "../../";
import { OidcRequest, OidcRequestInterface } from "./OidcRequest";

export interface OidcDecisionInterface {
  subject?: string;
  remember?: boolean;
  remember_for?: number;
  acr?: string;
  context?: { [key: string]: any };
  force_subject_identifier?: string;
  error?: string;
  error_description?: string;
  error_hint?: string;
  error_debug?: string;
  status_code?: number;
  request: OidcRequestInterface;
}

export class OidcDecision extends VDXFObject {
  subject?: string;
  remember?: boolean;
  remember_for?: number;
  acr?: string;
  context?: { [key: string]: any };
  force_subject_identifier?: string;
  error?: string;
  error_description?: string;
  error_hint?: string;
  error_debug?: string;
  status_code?: number;
  request: OidcRequest;

  constructor(decision: OidcDecisionInterface) {
    super(LOGIN_CONSENT_OIDC_DECISION_VDXF_KEY.vdxfid)

    this.subject = decision.subject;
    this.remember = decision.remember;
    this.remember_for = decision.remember_for;
    this.acr = decision.acr;
    this.context = decision.context;
    this.force_subject_identifier = decision.force_subject_identifier;
    this.error = decision.error;
    this.error_description = decision.error_description;
    this.error_hint = decision.error_hint;
    this.error_debug = decision.error_debug;
    this.status_code = decision.status_code;
    this.request = new OidcRequest(decision.request);
  }

  stringable() {
    return {
      vdxfkey: this.vdxfkey,
      subject: this.subject,
      remember: this.remember,
      remember_for: this.remember_for,
      acr: this.acr,
      context: this.context,
      force_subject_identifier: this.force_subject_identifier,
      error: this.error,
      error_description: this.error_description,
      error_hint: this.error_hint,
      error_debug: this.error_debug,
      status_code: this.status_code,
      request: this.request.stringable(),
    };
  }
}