import { LOGIN_CONSENT_CHALLENGE_VDXF_KEY, VDXFObject } from "../";

export class RedirectUri extends VDXFObject {
  uri: string;

  constructor(uri: string, vdxfkey: string) {
    super(vdxfkey);

    this.uri = uri
  }

  stringable() {
    return {
      uri: this.uri,
      vdxfkey: this.vdxfkey
    };
  }
}

export class Subject extends VDXFObject {
  data: string;

  constructor(data: string, vdxfkey: string) {
    super(vdxfkey);

    this.data = data
  }

  stringable() {
    return {
      data: this.data,
      vdxfkey: this.vdxfkey
    };
  }
}

export interface ChallengeInterface {
  // Challenge specific VDXF key
  challenge_id: string;

  // VDXF keys array of access requests
  requested_access?: Array<string> | null;

  // Array of members that will have access to scope
  requested_access_audience?: Array<string> | null;

  // Information about the ID you have to log in with, array of VDXF objects
  subject?: Array<Subject>;

  // Array of alternate authentication factors required
  alt_auth_factors?: Array<string> | null;

  // Temporary session ID
  session_id?: string;

  // List of signatures, IDs and trust score objects
  attestations?: null;

  // Array of VDXF objects defining behaviour on deeplink complete
  redirect_uris?: Array<RedirectUri>;

  // String of unix representation of date string
  created_at: string;

  // Random hash string
  salt?: string;

  // Context
  context?: { [key: string]: any };
}

export class Challenge extends VDXFObject implements ChallengeInterface {
  challenge_id: string;
  requested_access?: Array<string> | null;
  requested_access_audience?: Array<string> | null;
  subject?: Array<Subject>;
  alt_auth_factors?: Array<string> | null;
  session_id?: string;
  attestations?: null;
  redirect_uris?: Array<RedirectUri>;
  created_at: string;
  salt?: string;
  context?: { [key: string]: any };

  constructor(challenge: ChallengeInterface) {
    super(LOGIN_CONSENT_CHALLENGE_VDXF_KEY.vdxfid)

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
      context: this.context
    };
  }
}