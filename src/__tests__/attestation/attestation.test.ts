import { Hash160 } from "../../vdxf/classes/Hash160";
import { ATTESTATION_READ_REQUEST, IDENTITY_NAME_COMMITMENT_TXID, IDENTITY_REGISTRATION_TXID, IDENTITY_VIEW, ATTESTATION_IDENTITY_DATA, LOGIN_CONSENT_REDIRECT_VDXF_KEY } from "../../vdxf";
import { Attestation, LoginConsentRequest, LoginConsentResponse } from "../../vdxf/classes";
import { ProvisioningInfo, RedirectUri, RequestedPermission, Subject } from "../../vdxf/classes/Challenge";
import { Context } from "../../vdxf/classes/Context";
import { ProvisioningRequest } from "../../vdxf/classes/provisioning/ProvisioningRequest";
import { ProvisioningResponse } from "../../vdxf/classes/provisioning/ProvisioningResponse";
import { ProvisioningResult, ProvisioningTxid } from "../../vdxf/classes/provisioning/ProvisioningResult";
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
            requested_access: [new RequestedPermission(IDENTITY_VIEW.vdxfid),
              new RequestedPermission( ATTESTATION_READ_REQUEST.vdxfid, {accepted_attestors:["iC9x9VZ2XMop7spFzeXqSKX8WqmrG9cu41"], 
                                                                         attestation_keys:[
                                                                            ATTESTATION_IDENTITY_DATA["First Name"].vdxfid,
                                                                            ATTESTATION_IDENTITY_DATA["Last Name"].vdxfid,
                                                                            ATTESTATION_IDENTITY_DATA["Attestor"].vdxfid,
                                                                            ATTESTATION_IDENTITY_DATA["Identity"].vdxfid,
                                                                            ATTESTATION_IDENTITY_DATA["Document Type"].vdxfid]
                                                                        })],
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

        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["First Name"].vdxfid, salt: "8e6744dc4f229e543bbd00d65b395829e44c8eb7b358ee3131ca25e6ecc3b210", value: "Chris"})
        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["Last Name"].vdxfid, salt: "8e6744dc4f229e543bbd00d65b395829e44c8eb7b358ee3131ca25e6ecc3b210", value: "Monkins"})
        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["Attestor"].vdxfid, salt: "8e6744dc4f229e543bbd00d65b395829e44c8eb7b358ee3131ca25e6ecc3b210", value: "valu attestation@"})
        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["Identity"].vdxfid, salt: "8e6744dc4f229e543bbd00d65b395829e44c8eb7b358ee3131ca25e6ecc3b210", value: "chad@"})
        componentsArray.push({type: 1, attestationKey: ATTESTATION_IDENTITY_DATA["Document Type"].vdxfid, salt: "8e6744dc4f229e543bbd00d65b395829e44c8eb7b358ee3131ca25e6ecc3b210", value: "KYC Attestation v1"})
        componentsArray.push({type: 2, hash: "8e6744dc4f229e543bbd00d65b395829e44c8eb7b358ee3131ca25e6ecc3b210"})
        componentsArray.push({type: 2, hash: "8e6744dc4f229e543bbd00d65b395829e44c8eb7b358ee3131ca25e6ecc3b210"})

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
    
        const uri = _req.toWalletDeeplinkUri()
    
        expect(uri).toBe(LoginConsentRequest.fromWalletDeeplinkUri(uri).toWalletDeeplinkUri());
      });

  
});
