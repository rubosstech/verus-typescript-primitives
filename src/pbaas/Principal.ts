import varuint from '../utils/varuint'
import bufferutils from '../utils/bufferutils'
import { BigNumber } from '../utils/types/BigNumber';
import { TxDestination } from './TxDestination';
import { fromBase58Check, toBase58Check } from '../utils/address';
import { R_ADDR_VERSION } from '../constants/vdxf';
import { BN } from 'bn.js';

export const VERSION_INVALID = new BN(0, 10)
export const VERSION_CURRENT = new BN(1, 10)

const { BufferReader, BufferWriter } = bufferutils

export class Principal {
    flags: BigNumber;
    version: BigNumber;
    min_sigs: BigNumber;
    primary_addresses: TxDestination; 

    constructor (data?: { 
        version?: BigNumber, 
        flags?: BigNumber, 
        min_sigs?: BigNumber, 
        primary_addresses?: Array<string>;
      }) {
    
        this.flags = VERSION_INVALID;
        this.version = VERSION_INVALID;
    
        if (data != null) {
          if (data.flags != null) this.flags = data.flags
          if (data.version != null) this.version = data.version
          if (data.min_sigs != null) this.min_sigs = data.min_sigs
          if (data.primary_addresses != null) this.primary_addresses = new TxDestination({primary_addresses: data.primary_addresses});

        }
      }

    _dataByteLength() {
        let byteLength = 0;

        byteLength += 4; //uint32 version size
        byteLength += 4; //uint32 flags size

        byteLength += this.primary_addresses.getByteLength();
        byteLength += 4; //uint32 minimum signatures size

        return byteLength
    }

    _toBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this._dataByteLength()))

        bufferWriter.writeUInt32(this.version.toNumber())
        bufferWriter.writeUInt32(this.flags.toNumber())
        bufferWriter.writeSlice(this.primary_addresses.toBuffer());
        bufferWriter.writeUInt32(this.min_sigs.toNumber())

        return bufferWriter.buffer
    }

    _fromBuffer(buffer, offset: number = 0) {
        const reader = new BufferReader(buffer, offset);

        this.flags = new BN(reader.readUInt32(), 10);
        this.version = new BN(reader.readUInt32(), 10);

        reader.offset = this.primary_addresses.fromBuffer(reader.buffer, reader.offset);

        this.min_sigs = new BN(reader.readUInt32(), 10);

        return reader.offset;
    }
}