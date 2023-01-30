import { IDENTITY_VIEW, LOGIN_CONSENT_ID_PROVISIONING_SUBJECT_WEBHOOK_VDXF_KEY, LOGIN_CONSENT_PROVISIONING_ERROR_KEY_UNKNOWN, LOGIN_CONSENT_PROVISIONING_RESULT_STATE_PENDINGAPPROVAL, LOGIN_CONSENT_REDIRECT_VDXF_KEY } from "../../vdxf";
import { LoginConsentRequest, LoginConsentResponse } from "../../vdxf/classes";
import { RedirectUri, RequestedPermission, Subject } from "../../vdxf/classes/Challenge";
import { Context } from "../../vdxf/classes/Context";
import { ProvisioningRequest } from "../../vdxf/classes/provisioning/ProvisioningRequest";
import { ProvisioningResponse } from "../../vdxf/classes/provisioning/ProvisioningResponse";
import { ProvisioningResult } from "../../vdxf/classes/provisioning/ProvisioningResult";

describe('Serializes and deserializes signature objects properly', () => {
  test('loginconsentrequest/response', async () => {
    const req = new LoginConsentRequest({
      system_id: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      signing_id: "iB5PRXMHLYcNtM8dfLB6KwfJrHU2mKDYuU",
      signature: {
        signature:
          "AYG2IQABQSAN1fp6A9NIVbxvKuOVLLU+0I+G3oQGbRtS6u4Eampfb217Cdf5FCMScQhV9kMxtjI9GWzpchmjuiTB2tctk6qT",
      },
      challenge: {
        challenge_id: "iKNufKJdLX3Xg8qFru9AuLBvivAEJ88PW4",
        requested_access: [new RequestedPermission(IDENTITY_VIEW.vdxfid)],
        subject: [
          new Subject(
            "https://127.0.0.1/",
            LOGIN_CONSENT_ID_PROVISIONING_SUBJECT_WEBHOOK_VDXF_KEY.vdxfid
          ),
        ],
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

    expect(_res.toBuffer().toString('hex')).toBe(resbuf.toString('hex'));
    expect(_req.toBuffer().toString('hex')).toBe(reqbuf.toString('hex'));

    expect(_res.getDecisionHash(10000, 1).toString('hex')).toBe(res.getDecisionHash(10000, 1).toString('hex'))
    expect(_req.getChallengeHash(10000, 1).toString('hex')).toBe(req.getChallengeHash(10000, 1).toString('hex'))
    expect(_res.getDecisionHash(10000, 2).toString('hex')).toBe(res.getDecisionHash(10000, 2).toString('hex'))
    expect(_req.getChallengeHash(10000, 2).toString('hex')).toBe(req.getChallengeHash(10000, 2).toString('hex'))

    const uri = _req.toWalletDeeplinkUri()

    expect(uri).toBe(LoginConsentRequest.fromWalletDeeplinkUri(uri).toWalletDeeplinkUri());
  });

  test('provisioning request/response', async () => {
    const req = new ProvisioningRequest({
      signing_address: "RYQbUr9WtRRAnMjuddZGryrNEpFEV1h8ph",
      signature: {
        signature:
          "AYG2IQABQSAN1fp6A9NIVbxvKuOVLLU+0I+G3oQGbRtS6u4Eampfb217Cdf5FCMScQhV9kMxtjI9GWzpchmjuiTB2tctk6qT",
      },
      challenge: {
        challenge_id: "iKNufKJdLX3Xg8qFru9AuLBvivAEJ88PW4",
        created_at: 1664382484,
        salt: "i6NawEzHMocZnU4h8pPkGpHApvsrHjxwXE",
        context: new Context({
          ["i4KyLCxWZXeSkw15dF95CUKytEK3HU7em9"]: "test",
        }),
        name: "😊",
        system_id: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
        parent: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV"
      },
    });

    const res = new ProvisioningResponse({
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
        result: new ProvisioningResult({
          state: LOGIN_CONSENT_PROVISIONING_RESULT_STATE_PENDINGAPPROVAL.vdxfid,
          error_key: LOGIN_CONSENT_PROVISIONING_ERROR_KEY_UNKNOWN.vdxfid,
          error_desc: "Testing an error",
          identity_address: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
          info_uri: "127.0.0.1",
          provisioning_txid: "402e437df5aea8dc7af42f3072a43ef0e9e27edfbd2072c08aeea8e07024ee40",
          system_id: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
          fully_qualified_name: "😊.vrsc",
          parent: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV"
        }),
      }
    })

    const reqbuf = req.toBuffer()
    const _req = new ProvisioningRequest()
    _req.fromBuffer(reqbuf)

    const resbuf = res.toBuffer()
    const _res = new ProvisioningResponse()
    _res.fromBuffer(resbuf)

    expect(_res.toBuffer().toString('hex')).toBe(resbuf.toString('hex'));
    expect(_req.toBuffer().toString('hex')).toBe(reqbuf.toString('hex'));

    expect(_res.getDecisionHash(10000).toString('hex')).toBe(res.getDecisionHash(10000).toString('hex'))
    expect(_req.getChallengeHash().toString('hex')).toBe(req.getChallengeHash().toString('hex'))
  });
});
