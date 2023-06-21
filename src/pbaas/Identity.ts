import varuint from '../utils/varuint'
import bufferutils from '../utils/bufferutils'
import { BigNumber } from '../utils/types/BigNumber';
import { Principal } from './Principal';
import { fromBase58Check, toBase58Check } from '../utils/address';
import { I_ADDR_VERSION } from '../constants/vdxf';
import { R_ADDR_VERSION } from '../constants/vdxf';
import { BN } from 'bn.js';
const bech32 = require('bech32')

const VERSION_PBAAS = 3;

const { BufferReader, BufferWriter } = bufferutils

function fromBech32 (address) {
  var result = bech32.decode(address)
  var data = bech32.fromWords(result.words.slice(1))

  return {
    version: result.words[0],
    prefix: result.prefix,
    data: Buffer.from(data)
  }
}

function convertBits(data, from, to, strictMode) {
  const length = strictMode
    ? Math.floor((data.length * from) / to)
    : Math.ceil((data.length * from) / to);
  const mask = (1 << to) - 1;
  const result = Buffer.alloc(length);
  let index = 0;
  let accumulator = 0;
  let bits = 0;
  for (const value of data) {
    accumulator = (accumulator << from) | value;
    bits += from;
    while (bits >= to) {
      bits -= to;
      result[index] = (accumulator >> bits) & mask;
      ++index;
    }
  }
  if (!strictMode) {
    if (bits > 0) {
      result[index] = (accumulator << (to - bits)) & mask;
      ++index;
    }
  } else {
   throw new Error("Input cannot be converted")
  }
  return result;
}

function decodeSaplingAddress (address) {


  const result = fromBech32(address)

  const data = convertBits(result.data, 5, 8, false);

  return {d: data.slice(0,10), pk_d: data.slice(10)}

}

export class Identity extends Principal {

    parent: string;
    system_id: string;
    name: string;
    contentmap: Map<string,Buffer>;
    contentmultimap: Map<string,Array<Buffer>>;
    revocation_authority: string;
    recovery_authority: string;
    private_addresses: Array<{d: Buffer, pk_d: Buffer}>;
    timelock: number;

    constructor (data?: { 
        version?: BigNumber, 
        flags?: BigNumber, 
        primary_addresses?: Array<string>, 
        min_sigs?: BigNumber, 
        parent?: string, 
        system_id?: string, 
        name?: string,
        contentmap?: Map<string,Buffer>;
        contentmultimap?: Map<string,Array<Buffer>>;
        revocation_authority?: string;
        recovery_authority?: string;
        private_addresses: Array<{d: Buffer, pk_d: Buffer}>;
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
          if (data.private_addresses != null) this.private_addresses = data.private_addresses.map ( (addr) => {return decodeSaplingAddress(addr)})
        }
      }

    dataByteLength() {
        let byteLength = 0;

        byteLength += this._dataByteLength(); //get the principal byte length
        byteLength += 20;   //uint160 parent
        byteLength += varuint.encodingLength(Buffer.from(this.name, "utf8").length); // name compact size
        byteLength += Buffer.from(this.name, "utf8").length; // name_in_utf8_bytes

        // contentmultimap
        if (this.version.toNumber() >= VERSION_PBAAS) {

          byteLength += varuint.encodingLength(this.contentmultimap.size)

          for (const [key, value] of this.contentmultimap.entries()) {
            byteLength += 20;   //uint160 key
            byteLength += varuint.encodingLength(value.length)
              for (const n of value) {
                byteLength += varuint.encodingLength(n.length);
                byteLength += n.length;
              }
          }
        }

        //contentmap
        if (this.version.toNumber() < VERSION_PBAAS) {
          byteLength += varuint.encodingLength(this.contentmap.size)
          for (const m in this.contentmap) {
            byteLength += 20;   //uint160 key
            byteLength += 32;   //uint256 hash
          }
        }
        //contentmap2
        byteLength += varuint.encodingLength(this.contentmap.size)
        for (const m in this.contentmap) {
          byteLength += 20;   //uint160 key
          byteLength += 32;   //uint256 hash
        }

        byteLength += 20;   //uint160 revocation authority
        byteLength += 20;   //uint160 recovery authority

        // privateaddresses
        byteLength += varuint.encodingLength(this.private_addresses.length);

        for (const n of this.private_addresses) {
          byteLength += varuint.encodingLength(n.d.length); 
          byteLength += n.d.length;  // const 11
          byteLength += 32;   //pk_d hash
        }

        // post PBAAS
        if (this.version.toNumber() >= VERSION_PBAAS) {
          byteLength += 20;   //uint160 systemid
          byteLength += 4;    //uint32 unlockafter
        }

        return byteLength
    }

    toBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this._dataByteLength()))

        bufferWriter.writeSlice(this._toBuffer()); 
        bufferWriter.writeSlice(fromBase58Check(this.parent).hash);
        bufferWriter.writeCompactSize(Buffer.from(this.name, "utf8").length)
        bufferWriter.writeSlice(Buffer.from(this.name, "utf8"));

        //contentmultimap
        if (this.version.toNumber() < VERSION_PBAAS) {

          bufferWriter.writeCompactSize(this.contentmultimap.size)

          for (const [key, value] of this.contentmultimap.entries()) {

            bufferWriter.writeSlice(fromBase58Check(key).hash)
            bufferWriter.writeCompactSize(value.length)
            
              for (const n of value) {
                bufferWriter.writeCompactSize(n.length)
                bufferWriter.writeSlice(n);
                
              }
          }
        }

        //contentmap
        if (this.version.toNumber() < VERSION_PBAAS) {
          bufferWriter.writeCompactSize(this.contentmap.size)
          for (const [key, value] of this.contentmap.entries()) {
            bufferWriter.writeSlice(value);
          }
        }
    
        //contentmap2
        bufferWriter.writeCompactSize(this.contentmap.size)
        for (const [key, value] of this.contentmap.entries()) {
          bufferWriter.writeSlice(value);
        }

        bufferWriter.writeSlice(fromBase58Check(this.revocation_authority).hash)
        bufferWriter.writeSlice(fromBase58Check(this.recovery_authority).hash)

        // privateaddresses
        bufferWriter.writeCompactSize(this.private_addresses.length);

        for (const n of this.private_addresses) {
          bufferWriter.writeCompactSize(n.d.length); 
          bufferWriter.writeSlice(n.d);
          bufferWriter.writeSlice(n.pk_d);
        }

        // post PBAAS
        if (this.version.toNumber() >= VERSION_PBAAS) {
          bufferWriter.writeSlice(fromBase58Check(this.system_id).hash)
          bufferWriter.writeUInt32(this.timelock)
        }
        return bufferWriter.buffer
    }

    fromBuffer(buffer, offset: number = 0) {
        const reader = new BufferReader(buffer, offset);

        reader.offset = this._fromBuffer(reader.buffer, reader.offset);

        this.parent = toBase58Check(reader.readSlice(20), I_ADDR_VERSION)
        //TODO:

        return reader.offset;
    }
}