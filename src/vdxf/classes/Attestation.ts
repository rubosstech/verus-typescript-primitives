import varuint from '../../utils/varuint'
import bufferutils from '../../utils/bufferutils'
import { fromBase58Check, toBase58Check } from '../../utils/address';
import { I_ADDR_VERSION } from '../../constants/vdxf';
import {
    ATTESTATION_IDENTITY_DATA,
    Utf8DataVdxfObject,
    VDXFObject
  } from "../";

const { BufferReader, BufferWriter } = bufferutils;

const ATTESTATION_TYPE_DATA = 1;
const ATTESTATION_TYPE_HASH = 2;

export interface AttestationData{
    type?: number;
    attestationKey?: string;
    salt?: string;
    value?: string;
    hash?: string;
}


export class Attestation extends VDXFObject {
    type: number;
    nIndex: number;
    components: Array<AttestationData>;
    signatures: {[attestor: string]: string};

    constructor(vdxfkey: string = "", data?: { 
      type?: number;
      nIndex?: number;
      components?: Array<AttestationData>;
      signatures?: {[attestor: string]: string};

    }) {
      super(vdxfkey);

      if (data) {
        if (data?.type) this.type = data.type;
        if (data?.nIndex) this.nIndex = data.nIndex;
        if (data?.components) this.components = data.components;
        if (data?.signatures) this.signatures = data.signatures;
      }
      
    }


    dataByteLength(): number {
 
      let byteLength = 0;
      byteLength += varuint.encodingLength(this.type);
      byteLength += varuint.encodingLength(this.nIndex);

      byteLength += varuint.encodingLength(this.components.length)
      for (const n of this.components) {

        byteLength += varuint.encodingLength(n.type);

        if (n.type === ATTESTATION_TYPE_DATA) {
          byteLength += 20;  //key
          byteLength += 32;  //salt
          byteLength += varuint.encodingLength(Buffer.from(n.value, "utf8").length);
          byteLength += Buffer.from(n.value, "utf8").length;
        } else if (n.type === ATTESTATION_TYPE_HASH) {
          byteLength += 32;  //hash
        } else {
          throw new Error("Attestation Type not supported")
        }
      }

      const objKeys = Object.keys(this.signatures);
      byteLength += varuint.encodingLength(objKeys.length);

      for (const item of objKeys) {
        byteLength += 20;  //key
        byteLength += varuint.encodingLength(Buffer.from(this.signatures[item], "base64").length);
        byteLength += Buffer.from(this.signatures[item], "base64").length;

      }   
      return byteLength;
    }
  
    toBuffer(): Buffer {
      const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
      bufferWriter.writeCompactSize(this.type);
      bufferWriter.writeCompactSize(this.nIndex);
      bufferWriter.writeCompactSize(this.components.length);
      for (const n of this.components) {

        bufferWriter.writeCompactSize(n.type);

        if (n.type === ATTESTATION_TYPE_DATA) {
          bufferWriter.writeSlice(fromBase58Check(n.attestationKey).hash);
          bufferWriter.writeSlice(Buffer.from(n.salt, "hex"));
          bufferWriter.writeCompactSize(Buffer.from(n.value, "utf8").length)
          bufferWriter.writeSlice(Buffer.from(n.value, "utf8"));
        } else if (n.type === ATTESTATION_TYPE_HASH) {
          bufferWriter.writeSlice(Buffer.from(n.hash, "hex"));
        } else {
          throw new Error("Attestation Type not supported")
        }
      }

      const objKeys = Object.keys(this.signatures);
      bufferWriter.writeCompactSize(objKeys.length);

      for (const item of objKeys) {

        bufferWriter.writeSlice(fromBase58Check(item).hash);
        bufferWriter.writeVarSlice(Buffer.from(this.signatures[item], "base64"))

      }

      return bufferWriter.buffer
    }
  
    fromBuffer(buffer: Buffer, offset?: number): number {

      const reader = new bufferutils.BufferReader(buffer, offset);  
      this.type = reader.readVarInt().toNumber();
      this.nIndex = reader.readVarInt().toNumber();

      this.components = new Array();
      
      const componentsMapSize = reader.readVarInt();

      for (var i = 0; i < componentsMapSize.toNumber(); i++) {

        const type = reader.readVarInt().toNumber();

        if (type === ATTESTATION_TYPE_DATA) {
          const attestationKey = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
          const salt = Buffer.from(reader.readVarSlice()).toString('hex');
          const value = Buffer.from(reader.readVarSlice()).toString('utf8');
          this.components.push({type, attestationKey, salt, value});
        } else if (type === ATTESTATION_TYPE_HASH) {
          const hash = Buffer.from(reader.readVarSlice()).toString('hex');
          this.components.push({type, hash});
        } else {
          throw new Error("Attestation Type not supported")
        }
      }
    
      const signaturesSize = reader.readVarInt();
      this.signatures = {};

      for (var i = 0; i < signaturesSize.toNumber(); i++) {

        const attestor = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
        const signature = reader.readVarSlice().toString('base64');
        this.signatures[attestor] = signature;
      }
  
      return reader.offset;
    }
  }

