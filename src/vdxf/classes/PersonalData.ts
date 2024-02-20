import varuint from '../../utils/varuint'
import bufferutils from '../../utils/bufferutils'
import createHash = require("create-hash");
import { fromBase58Check, toBase58Check } from '../../utils/address';
import { I_ADDR_VERSION, HASH160_BYTE_LENGTH } from '../../constants/vdxf';
import { VDXFObject, VerusIDSignature } from "..";
import { CMerkleMountainRange, CMMRNode, CMerkleMountainView, CMMRProof } from "./MMR"
import { PERSONAL_INFO_OBJECT } from '../identitydatakeys';
import { Hash160 } from "./Hash160";
import { AttestationDataType } from './AttestationData';

const { BufferReader, BufferWriter } = bufferutils;

export class PersonalData extends VDXFObject {

  type: PersonalData.TYPE;
  id: string = '';
  data: {[category: string]: Array<AttestationDataType>};
  linkedAttestation: string = '';

  constructor(data?: {
    type?: PersonalData.TYPE,
    id?: string,
    data?: {[category: string]: Array<AttestationDataType>},
    linkedAttestation?: string
  }, vdxfkey: string = PERSONAL_INFO_OBJECT.vdxfid) {
    super(vdxfkey);

    if (data) {
      Object.assign(this, data);
    }
  }

  dataByteLength(): number {

    let byteLength = 0;
    byteLength += 1; // type
    byteLength += varuint.encodingLength(this.id.length);
    byteLength += this.id.length;
    
    byteLength += varuint.encodingLength(Object.keys(this.data).length);

    for (const [key, value] of Object.entries(this.data)) {

      byteLength += HASH160_BYTE_LENGTH; // category
      byteLength += varuint.encodingLength(value.length);

      for (const attestation of value) {
        byteLength += attestation.dataBytelength();
      }
    }

    byteLength += varuint.encodingLength(this.linkedAttestation.length);
    byteLength += this.linkedAttestation.length;

    return byteLength;
  }

  toDataBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));

    bufferWriter.writeCompactSize(this.type);
    bufferWriter.writeVarSlice(Buffer.from(this.id, 'utf8'));

    bufferWriter.writeCompactSize(Object.keys(this.data).length);
    
    for (const [key, value] of Object.entries(this.data)) {

      bufferWriter.writeSlice(fromBase58Check(key).hash);
      bufferWriter.writeCompactSize(value.length);

      for (const attestation of value) {
        bufferWriter.writeSlice(attestation.toBuffer());
      }
    }

    bufferWriter.writeVarSlice(Buffer.from(this.linkedAttestation, 'utf8'));
    return bufferWriter.buffer
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new BufferReader(buffer, offset);

    this.type = reader.readCompactSize();
    
    this.id = reader.readVarSlice().toString('utf8');

    const dataLength = reader.readCompactSize();

    if (!this.data) {
      this.data = {};
    }

    for (var i = 0; i < dataLength; i++) {

      const category = toBase58Check(reader.readSlice(HASH160_BYTE_LENGTH), I_ADDR_VERSION);
      const attestationLength = reader.readCompactSize();
      const attestations = [];

      for (var j = 0; j < attestationLength; j++) {

        const attestation = new AttestationDataType(null, toBase58Check(reader.buffer.slice(reader.offset, reader.offset + HASH160_BYTE_LENGTH), I_ADDR_VERSION));
        reader.offset = attestation.fromDataBuffer(reader.buffer, reader.offset);
        attestations.push(attestation);
      }

      this.data[category] = attestations;
    }

    this.linkedAttestation = reader.readVarSlice().toString('utf8');

    return reader.offset;
  }

  toJson() {
    return {
      type: this.type,
      id: this.id,
      data: this.data,
      linkedAttestation: this.linkedAttestation
    };
  }
}

export namespace PersonalData {
  export enum TYPE {
    REQUEST = 1,
    SUBMITTED = 2,
    DESIGNATED = 3,
  }
}
