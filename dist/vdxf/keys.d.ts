export interface VDXFKeyInterface {
    vdxfid: string;
    hash160result: string;
    qualifiedname: {
        name: string;
        namespace: string;
    };
}
export declare const LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_REQUEST_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_OIDC_REQUEST_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_RESPONSE_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_CHALLENGE_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_OIDC_CHALLENGE_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_DECISION_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_OIDC_DECISION_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_OIDC_CLIENT_VDXF_KEY: VDXFKeyInterface;
export declare const WALLET_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_REDIRECT_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_WEBHOOK_VDXF_KEY: VDXFKeyInterface;
