import * as keylist from './keys';
import varuint from '../utils/varuint'

export const keymap = Object.keys(keylist).map(x => keymap[keylist[x].vdxfid] = keylist[x]);

export const friendlyNames = (vdfxkey) => {

    if (vdfxkey in keymap) {
        
        switch (vdfxkey) {

            case keylist.IDENTITY_DATA_FIRSTNAME.vdxfid: 
                return "First Name";
            case keylist.IDENTITY_DATA_LASTNAME.vdxfid:
                return "Last Name";
            case keylist.IDENTITY_DATA_ATTESTOR.vdxfid:
                return "Attestor";
            case keylist.IDENTITY_DATA_IDENTITY.vdxfid:
                return "Identity";
            case keylist.ATTESTATION_TYPE.vdxfid:
                return "Attestation Type";
        }
        
    } else {
        throw new Error("Unknown VDXF key");
    }
}