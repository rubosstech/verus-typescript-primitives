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

const stringDataByteLength = function (data) {
    var length = 20;
    length += 1; // varint length 1
    length += 2; // ss type + ver (lengths)
    length += varuint.encodingLength(Buffer.from(data, 'utf8').length);
    length += Buffer.from(data, 'utf8').length;
    return length;
  }

export const utils: Function = (vdfxkey) => {

    if (vdfxkey in keymap) {
        
        switch (vdfxkey) {
            case keylist.DATA_TYPE_STRING.vdxfid:
                return stringDataByteLength
        }
        
    } else {
        throw new Error("Unknown VDXF key");
    }


}