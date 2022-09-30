import { LOGIN_CONSENT_CONTEXT_ID_PROCUREMENT_SUBJECT_VDXF_KEY, LOGIN_CONSENT_REDIRECT_VDXF_KEY } from "../../vdxf";
import { LoginConsentRequest, LoginConsentResponse } from "../../vdxf/classes";
import { RedirectUri, Subject } from "../../vdxf/classes/Challenge";
import { Context } from "../../vdxf/classes/Context";
import { Hash160 } from "../../vdxf/classes/Hash160";

describe('Serializes and deserializes signature objects properly', () => {
  test('loginconsentrequest', async () => {
    const req = new LoginConsentRequest({
      system_id: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      signing_id: "iB5PRXMHLYcNtM8dfLB6KwfJrHU2mKDYuU",
      signature: {
        signature:
          "AYG2IQABQSAN1fp6A9NIVbxvKuOVLLU+0I+G3oQGbRtS6u4Eampfb217Cdf5FCMScQhV9kMxtjI9GWzpchmjuiTB2tctk6qT",
      },
      challenge: {
        challenge_id: "iKNufKJdLX3Xg8qFru9AuLBvivAEJ88PW4",
        requested_access: [
          Hash160.fromAddress("i7TBEho8TUPg4ESPmGRiiDMGF55QJM37Xk"),
        ],
        subject: [
          new Subject(
            "https://127.0.0.1/",
            LOGIN_CONSENT_CONTEXT_ID_PROCUREMENT_SUBJECT_VDXF_KEY.vdxfid
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

    const uri = _req.toWalletDeeplinkUri()

    expect(uri).toBe(LoginConsentRequest.fromWalletDeeplinkUri(uri).toWalletDeeplinkUri());
  });
});
