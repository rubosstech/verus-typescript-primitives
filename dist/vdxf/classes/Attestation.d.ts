import { VDXF_Data } from './DataDescriptor';
export interface AttestationRequestInterface {
    attestationId: string;
    accepted_attestors: Array<string>;
    attestation_keys: Array<string>;
    attestor_filters?: Array<string>;
}
export declare class Attestation extends VDXF_Data {
    setAttestationViewRequestData(attestationId: string, accepted_attestors: Array<string>, attestation_keys: Array<string>, attestor_filters: Array<string>): void;
    getAttestationViewRequestData(): AttestationRequestInterface;
    getAttestationProvisioningData(): any[];
}
