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

export const LOGIN_CONSENT_OIDC_REQUEST_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "i5XKaak5R68S1oW55dDDu7XEkRZpRTFts6",
  hash160result: "e19a485ca8bce6540ace5f40e415a4a7d29a7716",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.oidcrequest",
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

export const LOGIN_CONSENT_OIDC_CHALLENGE_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iNiZWvtDmXSeYKNvu8GNZwCT3J9qFMrJwx",
  hash160result: "6c52ec072c07c0b15d5b46f67e18547ce5f311d3",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.request.oidcchallenge",
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

export const LOGIN_CONSENT_OIDC_DECISION_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "i49KeF2Ucd2NukXTbP2ArHX2JUtfqZRC63",
  hash160result: "890efbba846eac07b3220d197cfe9f2269615607",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.response.oidcdecision",
  },
};

export const LOGIN_CONSENT_OIDC_CLIENT_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iGo5omf7RubucEU6nM6THM6bhPgq1SjSqS",
  hash160result: "e3187c990ff432ba56cf3180b3661bcca0251c92",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.oidcclient",
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
  vdxfid: "iAPmsGJkkpMN1sCTF59fscV7jD8tv1whnk",
  hash160result: "8109473c99bc48562253bf2ddba2f6bf8cd9e24b",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.redirect",
  },
};

export const LOGIN_CONSENT_WEBHOOK_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iACPLH19SXKHoRJboWoxZHZRHz791Zii41",
  hash160result: "87b84b3dbfd7948f9156bb8bb81e2ebfab76bb49",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.webhook",
  },
};

export const LOGIN_CONSENT_CONTEXT_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "i4deKhDW1MBW6zYaTiwjd7pzzfkHB6Jj8c",
  hash160result: "054b0e981f24c456f7e2b63be85f9f5bf29eb10c",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.context",
  },
};

export const LOGIN_CONSENT_CONTEXT_ID_PROVISIONING_SUBJECT_VDXF_KEY: VDXFKeyInterface =
  {
    vdxfid: "iQpWgEa7JbB8cnGq8cf5ouXvsmT3E8dNq5",
    hash160result: "ed810ebcd23480e1effb114acb06dd91675422ea",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::system.identity.authentication.loginconsent.subject.procureverusid.webhook",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_REQUEST_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iSREBY27ZSurKg2c5aaCFJ1HbLcPMSUH6c",
  hash160result: "adbd9d6ae0db4cfe207190b93b8909b0b63eabfb",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.provisionverusid.request",
  },
};

export const LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iMA5n1wJB9j3juaikuTL2ZVVZAtSx9gDPu",
  hash160result: "261b9c412d179054116ac3372fa223f12d5cf5c1",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.provisionverusid.challenge",
  },
};

export const LOGIN_CONSENT_PROVISIONING_DECISION_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "i5GXbqeaNPRMniPGngAEWLWERiQAkbBrP4",
  hash160result: "4b8be37c1bc89355fc09b90bf25b42908966ab13",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.provisionverusid.decision",
  },
};

export const LOGIN_CONSENT_PROVISIONING_RESPONSE_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iQc5MQ2n9fCpgAgCaAanAvr1smkNYk3NNS",
  hash160result: "52eeb8f3dbac1c4bf9a53c0998819724b732c8e7",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.provisionverusid.response",
  },
};

export const LOGIN_CONSENT_PROVISIONING_NAME_VDXF_KEY: VDXFKeyInterface =
  {
    vdxfid: "iJ6f61LPkGwfFJqcVxErbUKwo6o4A9q8iE",
    hash160result: "8c3407247d37e221594d801736ab8e23f31f67a0",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::system.identity.authentication.loginconsent.provisionverusid.name",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_VDXF_KEY: VDXFKeyInterface =
  {
    vdxfid: "iJSajsPTkPJ3keg37xdP7n5j5ViikbiHES",
    hash160result: "eac9e93810e4ef44d99a588146ebbd2ab0d02ba4",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::system.identity.authentication.loginconsent.provisionverusid.errorkey",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_ERROR_DESC_VDXF_KEY: VDXFKeyInterface =
  {
    vdxfid: "i82RN1FGLxm7ZEyja8KbQwqwWcBrz4VexD",
    hash160result: "4d9e04cc2c8199510f70aa6e2df923e42bbfe831",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::system.identity.authentication.loginconsent.provisionverusid.errordesc",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_RESULT_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iGKBActPBLEVtuvt1Sci5yGwSLPX4PDNPe",
  hash160result: "eb7a3acc75a365f6ad44853ab47f450852f9d48c",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.provisionverusid.result",
  },
};

export const LOGIN_CONSENT_PROVISIONING_INFOTEXT_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iAp39jBwAk3zivgg8npQ4NZfsXdymKKHeQ",
  hash160result: "5ce637d58c7ee069def9f50ee09c2f3759977950",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.loginconsent.provisionverusid.infotext",
  },
};

export const LOGIN_CONSENT_PROVISIONING_RESULT_STATE_PENDINGREQUIREDINFO: VDXFKeyInterface = {
  "vdxfid": "iLdNndynBEZzbMexFakLKpAgZdkYPVnLkF",
  "hash160result": "24057ff4af0c8b771811230a02f2fd5143aa26bc",
  "qualifiedname": {
      "namespace": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      "name": "vrsc::identity.authentication.loginconsent.provisionverusid.result.state.pendingrequiredinformation"
  }
};

export const LOGIN_CONSENT_PROVISIONING_RESULT_STATE_PENDINGAPPROVAL: VDXFKeyInterface =
  {
    vdxfid: "iD8ghRtroVKJKbknKMH77hDeSUpxk7d6bY",
    hash160result: "1f58d59392f89f48f71fcddf116ee20322acf069",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::identity.authentication.loginconsent.provisionverusid.result.state.pendingapproval",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_RESULT_STATE_COMPLETE: VDXFKeyInterface =
  {
    vdxfid: "iSoWuQoEouj5obCBNrThAizDfEsNti1ZLw",
    hash160result: "fc0b90d5db87ea52805eab1b93a006fbdd5ae2ff",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::identity.authentication.loginconsent.provisionverusid.result.state.complete",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_RESULT_STATE_FAILED: VDXFKeyInterface =
  {
    vdxfid: "iQFXtyMtiP4WUnQN3TbkTN57FDCA7kvJ5u",
    hash160result: "3a0ab68d37f1a32f1ec293cc785f9d2efd9ee5e3",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::identity.authentication.loginconsent.provisionverusid.result.state.failed",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_NAMETAKEN: VDXFKeyInterface =
  {
    vdxfid: "i6R7zpzFZ4dEaXxshWn1QhJMpKPgKCrpVN",
    hash160result: "ddfa8f5840b0378fb1bb1104a50ae2b70f914320",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::identity.authentication.loginconsent.provisionverusid.errorkey.nametaken",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_UNKNOWN: VDXFKeyInterface = {
  vdxfid: "iAYHYTXnTT1oBHEsndNkTepevfgkc1jwwQ",
  hash160result: "e3a4905f695c5aef57384e29339c8dd616f37e4d",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::identity.authentication.loginconsent.provisionverusid.errorkey.unknown",
  },
};

export const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_RESERVATION_FAILED: VDXFKeyInterface =
  {
    vdxfid: "iFutXEh8ZV2nJMssbeEmAJ4TbpUC6r1auP",
    hash160result: "17cbe00fc2df8ad87b2d9306cfa6e3fc3b836d88",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::identity.authentication.loginconsent.provisionverusid.errorkey.reservationfailed",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_CREATION_FAILED: VDXFKeyInterface =
  {
    vdxfid: "iSHjwZjpoZf1rVffzXrjQCqjBThadXbaxj",
    hash160result: "e44227e5d2b6d8ff3ce4fddf282149bd4ac240fa",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::identity.authentication.loginconsent.provisionverusid.errorkey.creationfailed",
    },
  };

export const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_TRANSFER_FAILED: VDXFKeyInterface =
  {
    vdxfid: "iMRSgkUWKCwRnBhZoRwYmV67MNBifcE5eA",
    hash160result: "9faa8295a6db52d2e2bdc5eab0ff6b21ba0dddc4",
    qualifiedname: {
      namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      name: "vrsc::identity.authentication.loginconsent.provisionverusid.errorkey.transferfailed",
    },
  };