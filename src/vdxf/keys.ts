export interface VDXFKeyInterface {
  vdxfid: string;
  hash160result: string;
  qualifiedname: {
    name: string;
    namespace: string;
  };
}

export const LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iBFueEbXnSbohqiHNwwmz8Jb7LJtx2PGFu",
  hash160result: "28657ae163daff6bcb81034044699a4170235e55",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.signature",
  },
};

export const LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iBFueEbXnSbohqiHNwwmz8Jb7LJtx2PGFu",
  hash160result: "28657ae163daff6bcb81034044699a4170235e55",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.signature",
  },
};


export const LOGIN_CONSENT_REQUEST_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iDUwZMSrru6j4Bv1jDKy84xDZ8m2beoCuq",
  hash160result: "9ca63240a17ce53f9707f9df5920e4d39165c56d",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.request",
  },
};

export const LOGIN_CONSENT_RESPONSE_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iJQaibDkoUxwGoE2YhZtVVZyhKxZs1G7uU",
  hash160result: "a77ba0f8c5a05fcc1ef0fa0ed93dab1501f7caa3",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.response",
  },
};

export const LOGIN_CONSENT_CHALLENGE_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "i9dm793ZMVAs2prmdrS9TYLz3FhvhTCsQY",
  hash160result: "d3c4caf0874469673d98b82b02655c4294e98f43",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.request.challenge",
  },
};

export const LOGIN_CONSENT_DECISION_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "i7bCPAtS12cKwa7VevVZqgRusN4NXVCt5z",
  hash160result: "b870b7693cc7de39b8030dd8fcf99b063d83232d",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.response.decision",
  },
};

export const LOGIN_CONSENT_CLIENT_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iPuyaAq8PNetbcP5ut2RJFJBZ7YkowevQK",
  hash160result: "0aee6fd3bc6bad9287c5449620cc5e4023bc32e0",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.client",
  },
};

export const WALLET_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "i5JtwbP6zyMEAy9LLnRAGLgJQGdRFfsAu4",
  hash160result: "cb8486edea3f09c06c687327bda71487f30b1e14",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::applications.wallet",
  },
};

export const LOGIN_CONSENT_REDIRECT_VDXF_KEY: VDXFKeyInterface = {
  "vdxfid": "iAPmsGJkkpMN1sCTF59fscV7jD8tv1whnk",
  "hash160result": "8109473c99bc48562253bf2ddba2f6bf8cd9e24b",
  "qualifiedname": {
    "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    "name": "vrsc::system.identity.authentication.loginconsent.redirect"
  }
}

export const LOGIN_CONSENT_WEBHOOK_VDXF_KEY: VDXFKeyInterface = {
  "vdxfid": "iACPLH19SXKHoRJboWoxZHZRHz791Zii41",
  "hash160result": "87b84b3dbfd7948f9156bb8bb81e2ebfab76bb49",
  "qualifiedname": {
    "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    "name": "vrsc::system.identity.authentication.loginconsent.webhook"
  }
}
