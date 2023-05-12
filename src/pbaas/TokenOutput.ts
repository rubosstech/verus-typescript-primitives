import CurrencyValueMap from './CurrencyValueMap';
import varint from '../utils/varint'
import bufferutils from '../utils/bufferutils'
import { BN } from 'bn.js';
import { BigNumber } from '../utils/types/BigNumber';
const { BufferReader, BufferWriter } = bufferutils

// const VERSION_INVALID = 0
export const VERSION_CURRENT = new BN(1, 10)
export const VERSION_FIRSTVALID = new BN(1, 10)
export const VERSION_LASTVALID = new BN(1, 10)
export const VERSION_MULTIVALUE = new BN('80000000', 16)

export default class TokenOutput {
  version: BigNumber;
  reserve_values: CurrencyValueMap;

  constructor (data?: { values?: CurrencyValueMap, version?: BigNumber }) {
    this.version = VERSION_CURRENT;
    this.reserve_values = new CurrencyValueMap();

    if (data != null) {
      if (data.values != null) this.reserve_values = data.values
      if (data.version != null) this.version = data.version
    }
  }

  toBuffer () {
    const multivalue = !!(this.version.and(VERSION_MULTIVALUE).toNumber())

    if (multivalue) {
      this.reserve_values.multivalue = true
    }

    const serializedSize = varint.encodingLength(this.version) + this.reserve_values.getByteLength()

    const writer = new BufferWriter(Buffer.alloc(serializedSize))
    writer.writeVarInt(this.version)

    writer.writeSlice(this.reserve_values.toBuffer())
    return writer.buffer
  }

  fromBuffer (buffer: Buffer) {
    const reader = new BufferReader(buffer)
    this.version = reader.readVarInt()

    const multivalue = !!(this.version.and(VERSION_MULTIVALUE).toNumber())
    this.reserve_values = new CurrencyValueMap({multivalue})
    this.reserve_values.fromBuffer(reader.buffer, reader.offset)
  }

  firstCurrency () {
    const iterator = this.reserve_values.value_map.entries().next()
    return iterator.done ? null : iterator.value[0]
  }

  firstValue () {
    const iterator = this.reserve_values.value_map.entries().next()
    return iterator.done ? null : iterator.value[1]
  }

  getVersion () {
    return this.version
  }

  isValid () {
    return (
      this.version.gte(VERSION_FIRSTVALID) &&
      this.version.lte(VERSION_LASTVALID)
    )
  }
}