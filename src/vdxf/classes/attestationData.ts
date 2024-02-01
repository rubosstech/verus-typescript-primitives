import {
  Utf8DataVdxfObject,
  HexDataVdxfObject,
  BufferDataVdxfObject,
  PNGImageVdxfObject
} from "..";
import * as keylist from '../keys';
import { keymap } from '../keymap';
import bufferutils from '../../utils/bufferutils';
import createHash = require("create-hash");
import { fromBase58Check, toBase58Check } from '../../utils/address';
import varuint from '../../utils/varuint'
import { I_ADDR_VERSION, HASH160_BYTE_LENGTH } from '../../constants/vdxf';
const { BufferReader, BufferWriter } = bufferutils;

export const AttestationClassTypes = {
  BUFFER_DATA_STRING: 1,
  BUFFER_DATA_BYTES: 2,
  BUFFER_DATA_BASE64: 3,
  URL: 4,
  PNG_IMAGE: 5,
}

export const AttestationVdxfidMap = {
  [keylist.IDENTITY_DATA_FIRSTNAME.vdxfid]: { name: "First Name", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [keylist.IDENTITY_DATA_LASTNAME.vdxfid]: { name: "Last Name", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [keylist.IDENTITY_DATA_ATTESTOR.vdxfid]: { name: "Attestor ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [keylist.IDENTITY_DATA_IDENTITY.vdxfid]: { name: "Identity", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [keylist.ATTESTATION_TYPE.vdxfid]: { name: "Attestation Type", type: AttestationClassTypes.BUFFER_DATA_STRING },
};



export class AttestationDataType {

  dataItem: Utf8DataVdxfObject |  HexDataVdxfObject | BufferDataVdxfObject | PNGImageVdxfObject;
  salt: Buffer;

  constructor(data: any, vdxfkey: string, salt?: string) {

    if (vdxfkey in keymap) {
      switch (AttestationVdxfidMap[vdxfkey].type) {

        case AttestationClassTypes.BUFFER_DATA_STRING:
          this.dataItem = new Utf8DataVdxfObject(data, vdxfkey);
          break;
        case AttestationClassTypes.BUFFER_DATA_BYTES:
          this.dataItem = new HexDataVdxfObject(data, vdxfkey);
          break;
        case AttestationClassTypes.BUFFER_DATA_BASE64:
          this.dataItem = new BufferDataVdxfObject(data, vdxfkey, "base64");
          break;
        case AttestationClassTypes.URL:
          this.dataItem = new BufferDataVdxfObject(data, vdxfkey, "utf8");
          break;
        case AttestationClassTypes.PNG_IMAGE:
          this.dataItem = new PNGImageVdxfObject(data, vdxfkey);
          break;
        default:
          throw new Error("Unknown VDXF key");
      }
    } else {
      throw new Error("Unknown VDXF key");
    }

    if (salt) {
      this.salt = Buffer.from(salt, "hex");
    }
  }

  dataBytelength(): number {

    let length = 0;

    length += this.dataItem.byteLength();
    length += this.salt.length;

    return length;
  }

  toBuffer(): Buffer {

    const buffer = Buffer.alloc(this.dataBytelength());
    const writer = new bufferutils.BufferWriter(buffer);
    writer.writeSlice(this.dataItem.toBuffer());
    writer.writeSlice(this.salt);

    return writer.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset = 0, vdxfkey?: string): number {

    const reader = new bufferutils.BufferReader(buffer, offset);
    reader.offset = this.dataItem.fromBuffer(reader.buffer, reader.offset, vdxfkey);
    this.salt = reader.readSlice(32);

    return reader.offset;
  }
}

export const friendlyNames = (vdfxkey) => {

  if (vdfxkey in AttestationVdxfidMap) {

    return AttestationVdxfidMap[vdfxkey].name;

  } else {
    throw new Error("Unknown VDXF key");
  }
}

export class AttestationData {

  components: Map<number, AttestationDataType>;
  constructor(components: Map<number, AttestationDataType> = new Map()) {
    this.components = components;
  }

  dataByteLength(): number {
    let byteLength = 0;
    byteLength += varuint.encodingLength(this.components.size)

    for (const [key, item] of this.components) {
      byteLength += varuint.encodingLength(key);
      byteLength += item.dataBytelength();
    }

    return byteLength;
  }

  toDataBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));

    bufferWriter.writeCompactSize(this.components.size);

    for (const [key, item] of this.components) {
      bufferWriter.writeCompactSize(key);
      bufferWriter.writeSlice(item.toBuffer());
    }

    return bufferWriter.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new bufferutils.BufferReader(buffer, offset);
    const componentsLength = reader.readCompactSize();
    this.components = new Map();

    for (var i = 0; i < componentsLength; i++) {
      const key = reader.readCompactSize();
      const vdxfid = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
      const attestationData = new AttestationDataType(null, vdxfid);
      reader.offset = attestationData.fromDataBuffer(reader.buffer, reader.offset, vdxfid);

      this.components.set(key, attestationData);
    }

    return reader.offset;
  }

  size(): number {
    return this.components.size;
  }

  setDataFromJson(data: Array<AttestationDataType>, getSalt: Function) {

    if (!this.components) {
      this.components = new Map();
    }

    for (let i = 0; i < data.length; i++) {

      const item = data[i];

      if (!(item.salt instanceof Buffer) || item.salt.length !== 32) {
        if (typeof getSalt === "function") {
          item.salt = getSalt();
        } else {
          throw new Error("Salt is required to be a 32 random byte Buffer");
        }
      }

      try {
        fromBase58Check(item.dataItem.vdxfkey)
      } catch (e) {
        throw new Error("Attestation Key is required to be base58 format");
      }

      this.components.set(i, item);
    }

  }

  getHash(key): Buffer {

    let value: Buffer;

    value = this.components.get(key).toBuffer();

    return createHash("sha256").update(value).digest();
  }

}