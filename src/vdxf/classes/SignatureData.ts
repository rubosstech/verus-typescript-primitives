import varint from '../../utils/varint'
import varuint from '../../utils/varuint'
import { fromBase58Check, toBase58Check } from "../../utils/address";
import bufferutils from '../../utils/bufferutils'
import { BN } from 'bn.js';
import { BigNumber } from '../../utils/types/BigNumber';
import { I_ADDR_VERSION } from '../../constants/vdxf';
import { SerializableEntity } from '../../utils/types/SerializableEntity';
import { EHashTypes } from './DataDescriptor';
const { BufferReader, BufferWriter } = bufferutils

export class SignatureData implements SerializableEntity {
  version: BigNumber;
  systemID: string;
  hashType: BigNumber;
  signatureHash: Buffer;
  identityID: string;
  sigType: BigNumber;
  vdxfKeys: Array<string>;
  vdxfKeyNames: Array<string>;
  boundHashes: Array<Buffer>;
  signatureAsVch: Buffer;

  static VERSION_INVALID = new BN(0);
  static FIRST_VERSION = new BN(1);
  static LAST_VERSION = new BN(1);
  static DEFAULT_VERSION = new BN(1);
  static TYPE_VERUSID_DEFAULT = new BN(1);

  constructor(data?) {

    if (data) {
      Object.assign(this, data)
    }
  }

  static fromJson(data: any) {

    const signatureData = new SignatureData();

    if (data) {
      if (data.version) signatureData.version = new BN(data.version);
      if (data.systemid) signatureData.systemID = data.systemid;
      if (data.hashtype) signatureData.hashType = new BN(data.hashtype);

      if (signatureData.hashType == new BN(EHashTypes.HASH_SHA256)) {
        signatureData.signatureHash = Buffer.from(data.signaturehash, 'hex').reverse();
      } else {
        signatureData.signatureHash = Buffer.from(data.signaturehash, 'hex');
      }

      if (data.identityid) signatureData.identityID = data.identityid;
      if (data.signaturetype) signatureData.sigType = new BN(data.signaturetype);
      signatureData.vdxfKeys = data.vdxfkeys || [];
      signatureData.vdxfKeyNames = data.vdxfkeynames || [];
      signatureData.boundHashes = data.boundhashes || [];
      signatureData.signatureAsVch = Buffer.from(data.signature, 'base64');

    }

    return signatureData;
  }

  getByteLength() {
    let byteLength = 0;

    byteLength += varint.encodingLength(this.version);
    byteLength += 20; // systemID uint160
    byteLength += varint.encodingLength(this.hashType);
    byteLength += varuint.encodingLength(this.signatureHash.length);
    byteLength += this.signatureHash.length;
    byteLength += varint.encodingLength(this.sigType);
    byteLength += 20; // identityID uint160
    byteLength += varuint.encodingLength(this.vdxfKeys.length);
    byteLength += this.vdxfKeys.length * 20;
    byteLength += varuint.encodingLength(this.vdxfKeyNames.length);

    for (const keyName of this.vdxfKeyNames) {
      byteLength += varuint.encodingLength(Buffer.from(keyName, 'utf8').length);
      byteLength += Buffer.from(keyName, 'utf8').length;
    }

    byteLength += varuint.encodingLength(this.boundHashes.length);
    byteLength += this.boundHashes.length * 32;
    byteLength += varuint.encodingLength(this.signatureAsVch.length);
    byteLength += this.signatureAsVch.length;

    return byteLength
  }

  toBuffer() {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()))

    bufferWriter.writeVarInt(this.version);
    bufferWriter.writeSlice(fromBase58Check(this.systemID).hash);
    bufferWriter.writeVarInt(this.hashType);
    bufferWriter.writeVarSlice(this.signatureHash);
    bufferWriter.writeSlice(fromBase58Check(this.identityID).hash);
    bufferWriter.writeVarInt(this.sigType);
    bufferWriter.writeCompactSize(this.vdxfKeys.length);

    for (const key of this.vdxfKeys) {
      bufferWriter.writeSlice(fromBase58Check(key).hash);
    }

    bufferWriter.writeCompactSize(this.vdxfKeyNames.length);
    for (const keyName of this.vdxfKeyNames) {
      bufferWriter.writeVarSlice(Buffer.from(keyName, 'utf8'));
    }
    bufferWriter.writeCompactSize(this.boundHashes.length);
    for (const boundHash of this.boundHashes) {
      bufferWriter.writeSlice(boundHash);
    }
    bufferWriter.writeVarSlice(this.signatureAsVch);

    return bufferWriter.buffer
  }

  fromBuffer(buffer: Buffer, offset: number = 0) {
    const reader = new BufferReader(buffer, offset);

    this.version = reader.readVarInt();
    this.systemID = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
    this.hashType = reader.readVarInt();
    this.signatureHash = reader.readVarSlice();
    this.sigType = reader.readVarInt();
    this.identityID = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
    const vdxfKeysLength = reader.readCompactSize();
    this.vdxfKeys = [];

    for (let i = 0; i < vdxfKeysLength; i++) {
      this.vdxfKeys.push(toBase58Check(reader.readSlice(20), I_ADDR_VERSION));
    }

    const vdxfKeyNamesLength = reader.readCompactSize();
    this.vdxfKeyNames = [];

    for (let i = 0; i < vdxfKeyNamesLength; i++) {
      this.vdxfKeyNames.push(reader.readVarSlice().toString('utf8'));
    }

    const boundHashesLength = reader.readCompactSize();
    this.boundHashes = [];

    for (let i = 0; i < boundHashesLength; i++) {
      this.boundHashes.push(reader.readSlice(32));
    }

    this.signatureAsVch = reader.readVarSlice();

    return reader.offset;
  }
}