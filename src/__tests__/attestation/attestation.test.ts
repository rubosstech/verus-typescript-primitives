import { ATTESTATION_READ_REQUEST, IDENTITY_VIEW, ATTESTATION_IDENTITY_DATA, LOGIN_CONSENT_REDIRECT_VDXF_KEY } from "../../vdxf";
import { Attestation, LoginConsentRequest, LoginConsentResponse } from "../../vdxf/classes";
import { RedirectUri, RequestedPermission } from "../../vdxf/classes/Challenge";
import { Context } from "../../vdxf/classes/Context";

import { AttestationData } from "../../vdxf/classes/Attestation";

const SIMPLE_ATTESTATION = 1;

describe('Serializes and deserializes attestation request', () => {
    test('attestation request with reply', async () => {
        const req = new LoginConsentRequest({
          system_id: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
          signing_id: "iB5PRXMHLYcNtM8dfLB6KwfJrHU2mKDYuU",
          signature: {
            signature:
              "AYG2IQABQSAN1fp6A9NIVbxvKuOVLLU+0I+G3oQGbRtS6u4Eampfb217Cdf5FCMScQhV9kMxtjI9GWzpchmjuiTB2tctk6qT",
          },
          challenge: {
            challenge_id: "iKNufKJdLX3Xg8qFru9AuLBvivAEJ88PW4",
            requested_access: [new RequestedPermission("", IDENTITY_VIEW.vdxfid),
              new RequestedPermission( {accepted_attestors:["iC9x9VZ2XMop7spFzeXqSKX8WqmrG9cu41"], 
                                                                         attestation_keys:[
                                                                            ATTESTATION_IDENTITY_DATA["firstname"].vdxfid,
                                                                            ATTESTATION_IDENTITY_DATA["lastname"].vdxfid,
                                                                            ATTESTATION_IDENTITY_DATA["attestor"].vdxfid,
                                                                            ATTESTATION_IDENTITY_DATA["identity"].vdxfid,
                                                                            ATTESTATION_IDENTITY_DATA["documenttype"].vdxfid]
                                                                        }, ATTESTATION_READ_REQUEST.vdxfid)],
            session_id: "iRQZGW36o3RcVR1xyVT1qWdAKdxp3wUyrh",
            redirect_uris: [
              new RedirectUri(
                "https://www.verus.io",
                LOGIN_CONSENT_REDIRECT_VDXF_KEY.vdxfid
              ),
            ],
            created_at: 1664382484,
            salt: "i6NawEzHMocZnU4h8pPkGpHApvsrHjxwXE",
            context: new Context({
              ["i4KyLCxWZXeSkw15dF95CUKytEK3HU7em9"]: "test",
            }),
          },
        });

        const componentsArray = new Array<AttestationData>;

        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["firstname"].vdxfid, salt: "8e6744dc4f229e543bbd00d65b395829e44c8eb7b358ee3131ca25e6ecc3b210", value: "Chris"})
        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["lastname"].vdxfid, salt: "7c3920940db4385cd305557a57a8df33346712096e76b58d7c4ace05e17b90a2", value: "Monkins"})
        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["identity"].vdxfid, salt: "ce662d61a20ae211728cdb1b924628c84edfe0fcbd59a86f56a125ad73689ac1", value: "chad@"})
        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["attestor"].vdxfid, salt: "9067dc6a9b38dd15f985770bb819eb62de39a5d1f0e12f9a4807f78968794af4", value: "valu attestation@"})
        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["documenttype"].vdxfid, salt: "338b6ad44179f46fc24f3ed01fd247c9664384a71ba5465aebceece8d7c45a0a", value: "KYC Attestation v1"})
        componentsArray.push({type: 2, hash: "b5223370abb0b6d718d03fbef2d68b4b132b48045f3bc20f6d9322f2df74ddc5"})
        componentsArray.push({type: 2, hash: "6f2820034cfe309dd66d4503f1e5c06345c6aa3b2b00393a59a19b347ca187ab"})

        const signaturesForAttestation = {"i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV": "AYG2IQABQSAN1fp6A9NIVbxvKuOVLLU+0I+G3oQGbRtS6u4Eampfb217Cdf5FCMScQhV9kMxtjI9GWzpchmjuiTB2tctk6qT"};

        const attestationResponse = new Attestation("i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",{type: SIMPLE_ATTESTATION, nIndex: 123,components: componentsArray, signatures: signaturesForAttestation});
    
        const res = new LoginConsentResponse({
          system_id: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
          signing_id: "iB5PRXMHLYcNtM8dfLB6KwfJrHU2mKDYuU",
          signature: {
            signature:
              "AYG2IQABQSAN1fp6A9NIVbxvKuOVLLU+0I+G3oQGbRtS6u4Eampfb217Cdf5FCMScQhV9kMxtjI9GWzpchmjuiTB2tctk6qT",
          },
          decision: {
            decision_id: "iBTMBHzDbsW3QG1MLBoYtmo6c1xuzn6xxb",
            context: new Context({
              ["i4KyLCxWZXeSkw15dF95CUKytEK3HU7em9"]: "test",
            }),
            request: req,
            created_at: 1664392484,
            attestations: [attestationResponse]
          }
        })
    
        const reqbuf = req.toBuffer()
        const _req = new LoginConsentRequest()
        _req.fromBuffer(reqbuf)
    
        const resbuf = res.toBuffer()
        const _res = new LoginConsentResponse()
        _res.fromBuffer(resbuf)

        const checkres = _res.toBuffer()
        expect(checkres).toStrictEqual(resbuf);
        const uri = _req.toWalletDeeplinkUri()
    
        expect(uri).toBe(LoginConsentRequest.fromWalletDeeplinkUri(uri).toWalletDeeplinkUri());

        const mmr = await _res.decision.attestations[0].getMMR();

        const root = await mmr.getRoot();
        expect(Buffer.from(root).toString('hex')).toStrictEqual("65ee95e0a3eea24f3590aff4765736ee61547e42e8df960cc85c3f6d6bc00fc5")
      });

  
});
