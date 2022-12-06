import createHash = require("create-hash");
import { DEFAULT_VERSION, HASH160_BYTE_LENGTH, I_ADDR_VERSION } from '../constants/vdxf';
import { fromBase58Check, toBase58Check } from '../utils/address';
import bufferutils from '../utils/bufferutils';
import varuint from '../utils/varuint';
import { LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY, VDXFKeyInterface } from './keys';
export * from './keys'
export * from './scopes'

export interface VDXFObjectInterface {
  vdxfkey: string;
  toString: () => string;
  toJson: () => { [key: string]: any };
  toBuffer: () => Buffer;
  toDataBuffer: () => Buffer;
  fromDataBuffer: (buffer: Buffer, offset: number) => number;
  fromBuffer: (buffer: Buffer, offset: number) => number;
  dataByteLength: () => number;
  byteLength: () => number;
}

export interface VerusIDSignatureInterface {
  signature: string;
}

export class VDXFObject implements VDXFObjectInterface {
  vdxfkey: string;
  version: number;

  constructor(key: string = "") {
    this.vdxfkey = key;
    this.version = DEFAULT_VERSION;
  }

  toJson() {
    return {};
  }

  toString() {
    return this.toBuffer().toString('base64url')
  }

  dataByteLength() {
    return 0;
  }

  toDataBuffer() {
    return Buffer.alloc(0);
  }
  
  fromDataBuffer(buffer: Buffer, offset: number = 0) {
    return offset
  }

  fromBuffer(buffer: Buffer, offset: number = 0) {
    const reader = new bufferutils.BufferReader(buffer, offset);

    const keyHash = reader.readSlice(HASH160_BYTE_LENGTH);
    const version = reader.readVarInt();

    this.vdxfkey = toBase58Check(keyHash, I_ADDR_VERSION)
    this.version = version

    if (offset < buffer.length - 1) {
      reader.offset = this.fromDataBuffer(reader.buffer, reader.offset)
    }

    return reader.offset
  }

  byteLength() {
    const dataLength = this.dataByteLength();
    const keyLength = fromBase58Check(this.vdxfkey).hash.length
    const versionEncodingLength = varuint.encodingLength(this.version)
    const dataEncodingLength = varuint.encodingLength(dataLength)

    return dataLength + keyLength + versionEncodingLength + dataEncodingLength;
  }

  toBuffer() {
    const key = fromBase58Check(this.vdxfkey);
    const dataLength = this.dataByteLength();
    const buffer = Buffer.alloc(this.byteLength());
    const writer = new bufferutils.BufferWriter(buffer);

    writer.writeSlice(key.hash);
    writer.writeVarInt(this.version);

    if (dataLength) {      
      writer.writeVarSlice(this.toDataBuffer());
    }

    return writer.buffer;
  }

  toSha256() {
    return createHash("sha256").update(this.toBuffer()).digest();
  }
}

export class Utf8DataVdxfObject extends VDXFObject {
  data: string;

  constructor(data: string = "", vdxfkey: string = "") {
    super(vdxfkey);

    this.data = data
  }

  dataByteLength(): number {
    return this.toDataBuffer().length;
  }

  toDataBuffer(): Buffer {
    return Buffer.from(this.data, 'utf-8')
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);

    this.data = reader.readVarSlice().toString('utf-8')

    return reader.offset
  }

  toJson() {
    return {
      data: this.data,
      vdxfkey: this.vdxfkey
    };
  }
}

export class VerusIDSignature extends VDXFObject {
  signature: string;

  constructor(
    sig: VerusIDSignatureInterface = { signature: "" },
    vdxfkey: VDXFKeyInterface = LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY
  ) {
    super(vdxfkey.vdxfid);
    this.signature = sig.signature;
  }

  dataByteLength(): number {
    return this.toDataBuffer().length;
  }

  toDataBuffer(): Buffer {
    return Buffer.from(this.signature, "base64");
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);

    this.signature = reader.readVarSlice().toString("base64");

    return reader.offset;
  }

  toJson() {
    return {
      vdxfkey: this.vdxfkey,
      signature: this.signature,
    };
  }
}