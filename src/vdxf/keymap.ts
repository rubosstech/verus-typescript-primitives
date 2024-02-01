import * as keylist from './keys';
import * as AttestationData from './classes/attestationData';
export let keymap = Object.keys(keylist).reduce((obj: { [key: string]: any }, item) => { obj[keylist[item].vdxfid] = keylist[item]; return obj }, {});

export const AttestationVdxfidMap = AttestationData.AttestationVdxfidMap;