import varuint from '../utils/varuint'
import bufferutils from '../utils/bufferutils'
import { BigNumber } from '../utils/types/BigNumber';
import { Principal } from './Principal';
import { TxDestination } from './TxDestination';
import { fromBase58Check, toBase58Check } from '../utils/address';
import { R_ADDR_VERSION } from '../constants/vdxf';
import { BN } from 'bn.js';

export const VERSION_INVALID = new BN(0, 10)
export const VERSION_CURRENT = new BN(1, 10)

const { BufferReader, BufferWriter } = bufferutils

export class Identity extends Principal {

    parent: string;
    system_id: string;
    name: string;
    contentmap: Map<string,string>;
    contentmultimap: Map<string,string[]>;
    revocation_authority: string;
    recovery_authority: string;
    timelock: number;

    constructor (data?: { 
        version?: BigNumber, 
        flags?: BigNumber, 
        primary_addresses?: Array<string>, 
        min_sigs?: BigNumber, 
        parent?: string, 
        system_id?: string, 
        name?: string,
        contentmap?: Map<string,string>;
        contentmultimap?: Map<string,string[]>;
        revocation_authority?: string;
        recovery_authority?: string;
        timelock?: number;

      }) {
    
        super (data)
    
        if (data != null) {
          if (data.parent != null) this.parent = data.parent
          if (data.system_id != null) this.system_id = data.system_id
          if (data.min_sigs != null) this.min_sigs = data.min_sigs
          if (data.contentmap != null) this.contentmap = new Map(data.contentmap || []);
          if (data.contentmultimap != null) this.contentmultimap = new Map(data.contentmultimap || []);
          if (data.revocation_authority != null) this.revocation_authority = data.revocation_authority
          if (data.timelock != null) this.timelock = data.timelock
        }
      }

    dataByteLength() {
        let byteLength = 0;

        byteLength += this._dataByteLength(); //get the principal byte length
        length += fromBase58Check(this.parent).hash.length; // parent

        length += varuint.encodingLength(this.name.length) // name compact size
        length += this.name.length; // name_bytes

        //TODO:

        return byteLength
    }

    toBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this._dataByteLength()))

        //TODO:

        return bufferWriter.buffer
    }

    fromBuffer(buffer, offset: number = 0) {
        const reader = new BufferReader(buffer, offset);
     //TODO:

        return reader.offset;
    }
}