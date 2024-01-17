import varuint from '../../utils/varuint'
import bufferutils from '../../utils/bufferutils'
import createHash = require("create-hash");
import { fromBase58Check, toBase58Check } from '../../utils/address';
import { I_ADDR_VERSION } from '../../constants/vdxf';
import { VDXFObject } from "../";
import { MMR, MemoryBasedDb, CMMRBranch, VerusMMR } from "./MMR"
const { randomBytes } = require('crypto')

const { BufferReader, BufferWriter } = bufferutils;

export interface AttestationData {
  type: number;
  attestationKey: string;
  salt: Buffer;
  value: string | Buffer | URL;
}
export class Attestation extends VDXFObject {

  static TYPE_STRING = 1;
  static TYPE_BYTES = 2;
  static TYPE_BASE64 = 3;
  static TYPE_URL = 4;

  components: Map<number, AttestationData>;
  signatures: { [attestor: string]: { signature: string, system: string } };
  mmr: VerusMMR;

  constructor(vdxfkey: string = "", data?: {
    components?: Map<number, AttestationData>;
    signatures?: { [attestor: string]: { signature: string, system: string } };
    mmr?: VerusMMR;
  }) {
    super(vdxfkey);

    if (data) {
      this.components = data.components || null;
      this.signatures = data.signatures || null;
      this.mmr = data.mmr || null;
    }

  }

  determineType(value: string | Buffer | URL) {
    if (Buffer.isBuffer(value)) {
      return Attestation.TYPE_BYTES;
    }
    // Check if it's a Base64 string
    // Base64 string pattern: contains only Base64 characters and possibly padding at the end
    const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (typeof value === 'string' && base64Pattern.test(value)) {
      return Attestation.TYPE_BASE64;
    }
    if (value instanceof URL) {
      return Attestation.TYPE_URL;
    }
    return Attestation.TYPE_STRING;
  }

  dataByteLength(): number {

    let byteLength = 0;
    byteLength += varuint.encodingLength(this.components.size)

    for (const [key, item] of this.components) {
      byteLength += varuint.encodingLength(key)
      byteLength += 1;   //type
      byteLength += 20;  //vdxfid
      byteLength += 32;  //salt
      if (item.type === Attestation.TYPE_STRING) {
        byteLength += varuint.encodingLength(Buffer.from(item.value as string, "utf8").length);
        byteLength += Buffer.from(item.value as string, "utf8").length;
      } else if (item.type === Attestation.TYPE_BYTES) {
        byteLength += varuint.encodingLength((item.value as Buffer).length);
        byteLength += (item.value as Buffer).length;
      } else if (item.type === Attestation.TYPE_BASE64) {
        byteLength += varuint.encodingLength(Buffer.from(item.value as string, "base64").length);
        byteLength += Buffer.from(item.value as string, "base64").length;
      } else if (item.type === Attestation.TYPE_URL) {
        byteLength += varuint.encodingLength(Buffer.from((item.value as URL).toString(), "utf8").length);
        byteLength += Buffer.from((item.value as URL).toString(), "utf8").length;
      } else {
        throw new Error("Invalid Attestation Type");
      }
    }

    const sigKeys = Object.keys(this.signatures);
    byteLength += varuint.encodingLength(sigKeys.length);

    for (const item of sigKeys) {
      byteLength += 20;  //Attestor
      byteLength += 20;  //System
      byteLength += varuint.encodingLength(Buffer.from(this.signatures[item].signature, "base64").length);
      byteLength += Buffer.from(this.signatures[item].signature, "base64").length;

    }

    if (this.mmr) {
      byteLength += this.mmr.getbyteLength();

    } else {
      byteLength += varuint.encodingLength(0);
    }
    return byteLength;
  }

  toDataBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));

    bufferWriter.writeCompactSize(this.components.size);
    for (const [key, item] of this.components) {
      bufferWriter.writeUInt8(item.type);
      bufferWriter.writeCompactSize(key);
      bufferWriter.writeSlice(fromBase58Check(item.attestationKey).hash);
      bufferWriter.writeSlice(item.salt);

      if (item.type === Attestation.TYPE_STRING) {
        bufferWriter.writeVarSlice(Buffer.from(item.value as string, "utf8"))
      } else if (item.type === Attestation.TYPE_BYTES) {
        bufferWriter.writeVarSlice(item.value as Buffer)
      } else if (item.type === Attestation.TYPE_BASE64) {
        bufferWriter.writeVarSlice(Buffer.from(item.value as string, "base64"))
      } else if (item.type === Attestation.TYPE_URL) {
        bufferWriter.writeVarSlice(Buffer.from((item.value as URL).toString(), "utf8"))
      } else {
        throw new Error("Invalid Attestation Type");
      }
    }

    const objKeys = Object.keys(this.signatures);
    bufferWriter.writeCompactSize(objKeys.length);

    for (const item of objKeys) {

      bufferWriter.writeSlice(fromBase58Check(item).hash);
      bufferWriter.writeSlice(fromBase58Check(this.signatures[item].system).hash);
      bufferWriter.writeVarSlice(Buffer.from(this.signatures[item].signature, "base64"))

    }

    if (this.mmr) {

      bufferWriter.writeVarSlice(this.mmr.toBuffer());

    } else {
      bufferWriter.writeCompactSize(0);
    }

    return bufferWriter.buffer
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new bufferutils.BufferReader(buffer, offset);
    const attestationsByteLength = reader.readCompactSize(); //dummy read

    const componentsLength = reader.readCompactSize();
    this.components = new Map();

    for (var i = 0; i < componentsLength; i++) {
      const key = reader.readCompactSize();
      const type = reader.readUInt8();
      const attestationKey = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
      const salt = Buffer.from(reader.readSlice(32));
      const value = Buffer.from(reader.readVarSlice()).toString('utf8');
      this.components.set(key, { type, attestationKey, salt, value });
    }

    const signaturesSize = reader.readCompactSize();
    this.signatures = {};

    for (var i = 0; i < signaturesSize; i++) {

      const attestor = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
      const system = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
      const signature = reader.readVarSlice().toString('base64');
      this.signatures[attestor] = { signature, system };
    }

    const leafLength = reader.readCompactSize();

    if (leafLength > 0) {
      const referenceTreeLength = reader.readCompactSize();
      const nodes = {};

      for (var i = 0; i < referenceTreeLength; i++) {

        const nodeIndex = reader.readCompactSize();
        const signature = reader.readVarSlice();
        nodes[nodeIndex] = signature;
      }

      if (Object.keys(nodes).length > 0) {
        this.mmr = new MMR(new MemoryBasedDb(leafLength, nodes))
      }
    }

    return reader.offset;
  }

  async createMMR() {

    if (!this.mmr) {
      this.mmr = new MMR();
    } else {
      return this.mmr;
    }

    for (const [key, item] of this.components) {

      await this.mmr.append(this.getHash(key), key)

    }

    return this.mmr;
  }

  async routeHash() {

    if (!this.mmr) {
      await this.createMMR();
    }

    return await this.mmr.getRoot();
  }

  // returns an attestation with a sparse MMR containing the leaves specified
  async getProof(keys: Array<number>): Promise<Attestation> {

    const itemMaps = new Map();

    keys.forEach((key, index) => { itemMaps.set(index, this.components.get(key)) });

    const reply = new Attestation(this.vdxfkey, { components: itemMaps, mmr: await this.mmr.getProof(keys, null), signatures: this.signatures });

    return reply;

  }

  async checkProof() {

    try {

      for (const [key, item] of this.components) {

        const hash = this.getHash(key);
        const proof = await this.mmr.getProof([key], null);

        if (hash !== proof) {
          throw new Error("Attestation not found in MMR");
        }
      }
    } catch (e) {
      throw new Error("Error checking MMR");
    }
  }

  getHash(key): Buffer {

    let value: Buffer;

    if (this.components.get(key).type === Attestation.TYPE_STRING) {
      value = Buffer.from(this.components.get(key).value as string, "utf8");
    } else if (this.components.get(key).type === Attestation.TYPE_BYTES) {
      value = this.components.get(key).value as Buffer;
    } else if (this.components.get(key).type === Attestation.TYPE_BASE64) {
      value = Buffer.from(this.components.get(key).value as string, "base64");
    } else if (this.components.get(key).type === Attestation.TYPE_URL) {
      value = Buffer.from((this.components.get(key).value as URL).toString(), "utf8");
    } else {
      throw new Error("Invalid Attestation Type");
    }

    const bufferWriter = new BufferWriter(Buffer.alloc(1 + 20 + 32 + varuint.encodingLength(value.length) + value.length));
    bufferWriter.writeUInt8(this.components.get(key).type);
    bufferWriter.writeSlice(fromBase58Check(this.components.get(key).attestationKey).hash);
    bufferWriter.writeSlice(this.components.get(key).salt);
    bufferWriter.writeVarSlice(value);

    return createHash("sha256").update(bufferWriter.buffer).digest();

  }

  setData(data: Array<AttestationData>, getSalt: Function) {

    if (!this.components) {
      this.components = new Map();
    }

    for (let i = 0; i < data.length; i++) {

      const item = data[i];

      if (!(item.salt instanceof Buffer) || item.salt.length !== 32) {
        throw new Error("Salt is required to be a 32 random byte Buffer");
      }

      try {
        fromBase58Check(item.attestationKey)
      } catch (e) {
        throw new Error("Attestation Key is required to be base58 format");
      }

      if (this.determineType(item.value) != item.type) {
        throw new Error("Value is wrong type");
      }
      this.components.set(i, item);
    }

  }

}