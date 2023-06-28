import { Hash160 } from "../../vdxf/classes/Hash160";
import { ATTESTATION_READ_REQUEST, IDENTITY_NAME_COMMITMENT_TXID, IDENTITY_REGISTRATION_TXID, IDENTITY_VIEW, ATTESTATION_IDENTITY_DATA, LOGIN_CONSENT_REDIRECT_VDXF_KEY } from "../../vdxf";
import { Attestation, LoginConsentRequest, LoginConsentResponse } from "../../vdxf/classes";
import { ProvisioningInfo, RedirectUri, RequestedPermission, Subject } from "../../vdxf/classes/Challenge";
import { Context } from "../../vdxf/classes/Context";
import { ProvisioningRequest } from "../../vdxf/classes/provisioning/ProvisioningRequest";
import { ProvisioningResponse } from "../../vdxf/classes/provisioning/ProvisioningResponse";
import { ProvisioningResult, ProvisioningTxid } from "../../vdxf/classes/provisioning/ProvisioningResult";

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

        const test  = {"firstname": "John", "lastname": "Doe", 
        "identity":"jdoe123@", 
        "attestor": "valu attestation@", 
        "type":"simple name attestation v1" }

        const attestationResponse = new Attestation({data: {type: SIMPLE_ATTESTATION, components: {} }});
    
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
            created_at: 1664392484
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
