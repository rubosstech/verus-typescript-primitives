import varuint from '../../utils/varuint'
import bufferutils from '../../utils/bufferutils'
import createHash = require("create-hash");
import { fromBase58Check, toBase58Check } from '../../utils/address';
import { I_ADDR_VERSION, HASH160_BYTE_LENGTH } from '../../constants/vdxf';
import { VDXFObject, VerusIDSignature } from "../";
import { CMerkleMountainRange, CMMRNode, CMerkleMountainView, CMMRProof } from "./MMR"
import { ATTESTATION_OBJECT, ATTESTATION_VIEW_RESPONSE } from '../keys';
import { Hash160 } from "./Hash160";

const { BufferReader, BufferWriter } = bufferutils;
export interface AttestationInterface {
  type: number;
  attestationKey: string;
  salt: Buffer;
  value: string | Buffer | URL;
}

export class AttestationData {

  components: Map<number, AttestationInterface>;
  constructor(components: Map<number, AttestationInterface> = new Map()) {
    this.components = components;
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

  componentDataByteLength(key: number, forhash: boolean = false): number {
    let byteLength = 0;

    const item = this.components.get(key);
    if (!forhash) {
      byteLength += varuint.encodingLength(key);   //key
    }
    if (!item.type) {
      item.type = this.determineType(item.value);
    }
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

    return byteLength;
  }

  dataByteLength(): number {
    let byteLength = 0;
    byteLength += varuint.encodingLength(this.components.size)

    for (const [key, item] of this.components) {
      byteLength += this.componentDataByteLength(key);
    }

    return byteLength;
  }

  componentToDataBuffer(key: number, forHash: boolean = false): Buffer {

    const bufferWriter = new BufferWriter(Buffer.alloc(this.componentDataByteLength(key)));

    const item = this.components.get(key);
    if (!forHash) {
      bufferWriter.writeCompactSize(key);
    }
    bufferWriter.writeUInt8(item.type);
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

    return bufferWriter.buffer;

  }

  toDataBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));

    bufferWriter.writeCompactSize(this.components.size);

    for (const [key, item] of this.components) {
      bufferWriter.writeSlice(this.componentToDataBuffer(key));
    }

    return bufferWriter.buffer;
  }

  componentsFromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new bufferutils.BufferReader(buffer, offset);
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

    return reader.offset;
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new bufferutils.BufferReader(buffer, offset);

    reader.offset = this.componentsFromDataBuffer(reader.buffer, reader.offset);

    return reader.offset;

  }
  size(): number {
    return this.components.size;
  }

  setData(data: Array<AttestationInterface>, getSalt: Function) {

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

  getHash(key): Buffer {

    let value: Buffer;

    value = this.componentToDataBuffer(key, true);

    return createHash("sha256").update(value).digest();
  }

}
export class Attestation extends VDXFObject {

  static TYPE_STRING = 1;
  static TYPE_BYTES = 2;
  static TYPE_BASE64 = 3;
  static TYPE_URL = 4;

  data: AttestationData;
  system_id: string;
  signing_id: string;
  signature?: VerusIDSignature;
  mmr: CMerkleMountainRange;

  constructor(data?: {
    data?: AttestationData;
    signature?: VerusIDSignature;
    mmr?: CMerkleMountainRange;
    system_id: string,
    signing_id: string,
  }, vdxfkey: string = ATTESTATION_OBJECT.vdxfid) {
    super(vdxfkey);

    if (data) {
      this.data = data.data;
      this.signature = data.signature
      this.mmr = data.mmr;
      this.system_id = data.system_id;
      this.signing_id = data.signing_id;
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

    byteLength += this.data.dataByteLength();

    const _system_id = Hash160.fromAddress(this.system_id);
    const _signing_id = Hash160.fromAddress(this.signing_id);
    const _signature = this.signature
      ? this.signature
      : new VerusIDSignature(
        { signature: "" },
      );

      byteLength += _system_id.byteLength();
      byteLength += _signing_id.byteLength();
      byteLength += _signature.byteLength();

    if (this.mmr) {
      byteLength += this.mmr.getbyteLength();

    } else {
      byteLength += varuint.encodingLength(0);
    }
    return byteLength;
  }

  toDataBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));

    bufferWriter.writeSlice(this.data.toDataBuffer());

    const _system_id = Hash160.fromAddress(this.system_id);
    const _signing_id = Hash160.fromAddress(this.signing_id);
    const _signature = this.signature
      ? this.signature
      : new VerusIDSignature(
        { signature: "" },
      );

    bufferWriter.writeSlice(_system_id.toBuffer());
    bufferWriter.writeSlice(_signing_id.toBuffer());
    bufferWriter.writeSlice(_signature.toBuffer());

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

    if (!this.data) {
      this.data = new AttestationData();
    }

    reader.offset = this.data.componentsFromDataBuffer(reader.buffer, reader.offset);

    this.system_id = toBase58Check(
      reader.readSlice(HASH160_BYTE_LENGTH),
      I_ADDR_VERSION
    );

    this.signing_id = toBase58Check(
      reader.readSlice(HASH160_BYTE_LENGTH),
      I_ADDR_VERSION
    );

    const _sig = new VerusIDSignature();
    reader.offset = _sig.fromBuffer(reader.buffer, reader.offset);
    this.signature = _sig;

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
        this.mmr = new CMerkleMountainRange().fromBuffer(reader.buffer);
      }
    }

    return reader.offset;
  }

  createMMR() {

    if (!this.mmr) {
      this.mmr = new CMerkleMountainRange();
    } else {
      return this.mmr;
    }

    for (const [key, item] of this.data.components) {

      this.mmr.add(new CMMRNode(this.getHash(key)))

    }

    return this.mmr;
  }

  rootHash() {

    if (!this.mmr) {
      this.createMMR();
    }
    const view = new CMerkleMountainView(this.mmr)

    return view.GetRoot();
  }

  // returns an attestation with a sparse MMR containing the leaves specified
  getProof(keys: Array<number>): CPartialAttestationProof {

    const view = new CMerkleMountainView(this.mmr);
    const attestationItems = new AttestationData()
    const localCMMR = new CMMRProof();

    keys.forEach((key, index) => {
      view.GetProof(localCMMR, key);
      attestationItems.components.set(key, this.data.components.get(key));
    });

    const attestationAndProof = new CPartialAttestationProof({ 
      proof: localCMMR, 
      componentsArray: attestationItems,
      system_id: this.system_id,
      signing_id: this.signing_id,});

    return attestationAndProof;

  }

  async checkProof() {

    try {

      for (const [key, item] of this.data.components) {

        const hash = this.getHash(key);
        const proof = null//await this.mmr.getProof([key], null);

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

    value = this.data.componentToDataBuffer(key, true);

    return createHash("sha256").update(value).digest();
  }

}

export class CPartialAttestationProof extends VDXFObject {

  private EType = {
    TYPE_INVALID: 0,
    TYPE_ATTESTATION: 1,
    TYPE_LAST: 1
  }

  type: number;                         // this may represent differnt types of attestations
  proof: CMMRProof;          // proof of the attestation in the MMR
  componentsArray: AttestationData;
  system_id: string;
  signing_id: string;
  signature?: VerusIDSignature;

  constructor(data?: {
    proof?: CMMRProof;
    componentsArray?: AttestationData;
    system_id: string,
    signing_id: string,
  }, vdxfkey: string = ATTESTATION_VIEW_RESPONSE.vdxfid) {
    super(vdxfkey);
    this.type = this.EType.TYPE_ATTESTATION;
    if (data) {
      this.proof = data.proof || new CMMRProof();
      this.componentsArray = data.componentsArray || new AttestationData();
      this.system_id = data.system_id;
      this.signing_id = data.signing_id;
    }
  }

  dataByteLength(): number {

    let byteLength = 0;

    byteLength += varuint.encodingLength(this.type);
    byteLength += this.proof.dataByteLength();
    byteLength += this.componentsArray.dataByteLength();

    const _system_id = Hash160.fromAddress(this.system_id);
    const _signing_id = Hash160.fromAddress(this.signing_id);
    const _signature = this.signature
      ? this.signature
      : new VerusIDSignature(
        { signature: "" },
      );

    byteLength += _system_id.byteLength();
    byteLength += _signing_id.byteLength();
    byteLength += _signature.byteLength();

    return byteLength;

  }

  toDataBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));

    bufferWriter.writeCompactSize(this.type);
    bufferWriter.writeSlice(this.proof.toBuffer());
    bufferWriter.writeSlice(this.componentsArray.toDataBuffer());

    const _system_id = Hash160.fromAddress(this.system_id);
    const _signing_id = Hash160.fromAddress(this.signing_id);
    const _signature = this.signature
      ? this.signature
      : new VerusIDSignature(
        { signature: "" },
      );

    bufferWriter.writeSlice(_system_id.toBuffer());
    bufferWriter.writeSlice(_signing_id.toBuffer());
    bufferWriter.writeSlice(_signature.toBuffer());

    return bufferWriter.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new bufferutils.BufferReader(buffer, offset);

    this.type = reader.readCompactSize(); 
    this.proof = new CMMRProof();

    reader.offset = this.proof.fromDataBuffer(reader.buffer, reader.offset);

    this.system_id = toBase58Check(
      reader.readSlice(HASH160_BYTE_LENGTH),
      I_ADDR_VERSION
    );

    this.signing_id = toBase58Check(
      reader.readSlice(HASH160_BYTE_LENGTH),
      I_ADDR_VERSION
    );

    const _sig = new VerusIDSignature();
    reader.offset = _sig.fromBuffer(reader.buffer, reader.offset);
    this.signature = _sig;

    return reader.offset;
  }

  checkProof(item: number): Buffer {

    const dataHash = this.componentsArray.getHash(item)
    let currentIndex = 0;
    const component = this.componentsArray.components.get(item);

    for (let value of this.componentsArray.components.values()) {
      if (component == value) {
        return this.proof.proofSequence[currentIndex].safeCheck(dataHash);
      }
      currentIndex++;
    }

    return Buffer.allocUnsafe(32);
  }
}
