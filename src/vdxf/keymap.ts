import * as keylist from './keys';
import * as AttestationData from './classes/AttestationData';
export const keymap = Object.keys(keylist).reduce((obj: { [key: string]: any }, item) => { obj[keylist[item].vdxfid] = keylist[item]; return obj }, {});
export const attestationDataKeys = Object.keys(AttestationData).reduce((obj: { [key: string]: any }, item) => { obj[AttestationData[item].vdxfid] = AttestationData[item]; return obj }, {});
export const AttestationDataVdxfidMap = AttestationData.AttestationVdxfidMap;