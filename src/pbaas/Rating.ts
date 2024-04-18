import varint from '../utils/varint'
import varuint from '../utils/varuint'
import { fromBase58Check, toBase58Check } from "../utils/address";
import bufferutils from '../utils/bufferutils'
import { BN } from 'bn.js';
import { BigNumber } from '../utils/types/BigNumber';
import { I_ADDR_VERSION } from '../constants/vdxf';
import { SerializableEntity } from '../utils/types/SerializableEntity';
const { BufferReader, BufferWriter } = bufferutils

export class Rating implements SerializableEntity {
  version: BigNumber;
  trustLevel: BigNumber;
  ratings: Map<string,Buffer>;

  constructor (data: { version?: BigNumber, trustLevel?: BigNumber, ratings?: Map<string,Buffer>} = {}) {
    this.version = data.version || new BN(1, 10);
    this.trustLevel = data.trustLevel || new BN(0, 10);
    this.ratings = new Map(data.ratings || []);
  }

  getByteLength() {
    let byteLength = 0;

    byteLength += 4; // version uint32
    byteLength + 1; // trustLevel uint8
    byteLength += varuint.encodingLength(this.ratings.size);

    for (const [key, value] of this.ratings) {
      byteLength += 20
      byteLength += varint.encodingLength(new BN(value.length))
      byteLength += value.length

    }

    return byteLength
  }

  toBuffer () {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()))

    bufferWriter.writeUInt32(this.version.toNumber());
    bufferWriter.writeUInt8(this.trustLevel.toNumber());
    
    bufferWriter.writeCompactSize(this.ratings.size);

    for (const [key, value] of this.ratings) {
      const { hash } = fromBase58Check(key);

      bufferWriter.writeSlice(hash);
      bufferWriter.writeVarSlice(value);
    }

    return bufferWriter.buffer
  }

  fromBuffer (buffer: Buffer, offset: number = 0) {
    const reader = new BufferReader(buffer, offset);
    
    this.version = new BN(reader.readUInt32());
    this.trustLevel = new BN(reader.readUInt8());

    const count = reader.readCompactSize();

    for (let i = 0; i < count; i++) {
      const hash = reader.readSlice(20)
      const value = reader.readVarSlice()

      const base58Key = toBase58Check(hash, I_ADDR_VERSION)

      this.ratings.set(base58Key, value)
    }

    return reader.offset;
  }
}