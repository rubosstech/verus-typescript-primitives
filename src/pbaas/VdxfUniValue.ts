import varuint from '../utils/varuint'
import bufferutils from '../utils/bufferutils'
import { BigNumber } from '../utils/types/BigNumber';
import { fromBase58Check, toBase58Check } from '../utils/address';
import { HASH160_BYTE_LENGTH, I_ADDR_VERSION } from '../constants/vdxf';
import { BN } from 'bn.js';
import { DATA_TYPE_STRING } from '../vdxf';
import { SerializableEntity } from '../utils/types/SerializableEntity';
import varint from '../utils/varint';

export const VDXF_UNI_VALUE_VERSION_INVALID = new BN(0, 10);
export const VDXF_UNI_VALUE_VERSION_CURRENT = new BN(1, 10);

const { BufferWriter, BufferReader } = bufferutils

// TODO: Add other type definitions
export type VdxfUniType = string | Buffer;
export type VdxfUniValueJson = { [key: string]: string };

// This UniValue class was adapted from C++ code for encoding JSON objects into bytes. It is not serialization and
// therefore doesn't have a fromBuffer function, as you can't reliably decode it, only encode.
export class VdxfUniValue implements SerializableEntity {
  values: Map<string, VdxfUniType>;
  version: BigNumber;

  constructor(data?: { values: Map<string, VdxfUniType>, version?: BigNumber }) {
    if (data?.values) this.values = data.values;
    if (data?.version) this.version = data.version;
    else this.version = VDXF_UNI_VALUE_VERSION_CURRENT;
  }

  getByteLength() {
    let length = 0;

    for (const key of this.values.keys()) {
      const value = this.values.get(key);
      length += HASH160_BYTE_LENGTH;
      length += varint.encodingLength(this.version);

      if (key == DATA_TYPE_STRING.vdxfid) {
        const valueString = (value as string);
        const valBuf = Buffer.from(valueString, 'utf8');

        //NOTE 3 is from ss type + ver + vdxfidver 
        length += varint.encodingLength(new BN(valBuf.length + 3));

        length += varuint.encodingLength(valBuf.length);
        length += valBuf.length;
      } else throw new Error("Invalid or unrecognized vdxf key for object type")
    }

    return length;
  }

  toBuffer() {
    const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));

    for (const key of this.values.keys()) { 
      const value = this.values.get(key);
      writer.writeSlice(fromBase58Check(key).hash)
      writer.writeVarInt(this.version);

      if (key == DATA_TYPE_STRING.vdxfid) {
        const valueString = value as string;
        const valBuf = Buffer.from(valueString, 'utf8');

        //NOTE 3 is from ss type + ver + vdxfidver 
        writer.writeVarInt(new BN(valBuf.length + 3));

        writer.writeVarSlice(valBuf);
      } else throw new Error("Invalid or unrecognized vdxf key for object type")
    }

    return writer.buffer;
  }

  fromBuffer(buffer: Buffer, offset: number = 0, keylist: Array<string> = []): number {
    const reader = new BufferReader(buffer, offset);
    let lastPrereadOffset = reader.offset;

    function readNextKey() {
      lastPrereadOffset = reader.offset;

      try {
        return toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
      } catch(e) {
        return null;
      }
    }

    this.values = new Map();

    for (const key of keylist) {
      const dataTypeKey = readNextKey();
      this.version = reader.readVarInt();

      if (this.version.gt(VDXF_UNI_VALUE_VERSION_CURRENT)) throw new Error("Unknown VDXFUniValue version");

      if (dataTypeKey == DATA_TYPE_STRING.vdxfid) {
        reader.readVarInt();

        const slice = reader.readVarSlice();

        this.values.set(dataTypeKey, slice.toString('utf8'));
      } else {
        throw new Error("Invalid or unrecognized vdxf key for object type")
      }
    }

    return reader.offset;
  }

  static fromJson(obj: VdxfUniValueJson) {
    const map = new Map()

    for (const key in obj) {
      map.set(key, obj[key]);
    }

    return new VdxfUniValue({
      values: map
    })
  }

  toJson(): VdxfUniValueJson {
    const ret = {};

    for (const key of this.values.keys()) {
      ret[key] = this.values.get(key) as string;
    }

    return ret;
  }
}