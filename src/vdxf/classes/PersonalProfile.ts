import varuint from '../../utils/varuint'
import bufferutils from '../../utils/bufferutils'
import { fromBase58Check, toBase58Check } from '../../utils/address';
import { I_ADDR_VERSION, HASH160_BYTE_LENGTH } from '../../constants/vdxf';
import { VDXFObject } from "..";
import { AttestationDataType } from './Attestation';
import * as identitykeys from '../identityDataKeys';
const { BufferReader, BufferWriter } = bufferutils;

export class DataCategory {
  data: Array<VDXFObject>;
  category: string;
  vdxfid: string;
  constructor(data: Array<VDXFObject> | Array<{vdxfid: string}>, category: string, vdxfid: string) {
    if (data && data[0] instanceof VDXFObject) {
      this.data = data as Array<VDXFObject>;
    } else if (data){
      this.data = (data as Array<{vdxfid: string}>).map(key => {return AttestationDataType.getDataItem(key.vdxfid, null)});
    }
    this.category = category;
    this.vdxfid = vdxfid;
  }
}

class PersonalDataCategory extends DataCategory {
  constructor() {
    super([
      identitykeys.IDENTITYDATA_FIRSTNAME,
      identitykeys.IDENTITYDATA_LASTNAME,
      identitykeys.IDENTITYDATA_DATEOFBIRTH,
      identitykeys.IDENTITYDATA_HOMEADDRESS_COUNTRY
    ], "personal",
    identitykeys.IDENTITYDATA_PERSONAL_DETAILS.vdxfid);
  }
}

class ContactDataCategory extends DataCategory {
  constructor() {
    super([
      identitykeys.IDENTITYDATA_EMAIL,
      identitykeys.IDENTITYDATA_PHONENUMBER
    ], "contact",
    identitykeys.IDENTITYDATA_CONTACT.vdxfid);
  }
}

class LocationDataCategory extends DataCategory {
  constructor() {
    super([
      identitykeys.IDENTITYDATA_HOMEADDRESS_STREET1,
      identitykeys.IDENTITYDATA_HOMEADDRESS_STREET2,
      identitykeys.IDENTITYDATA_HOMEADDRESS_CITY,
      identitykeys.IDENTITYDATA_HOMEADDRESS_REGION,
      identitykeys.IDENTITYDATA_HOMEADDRESS_POSTCODE
    ], "locations",
    identitykeys.IDENTITYDATA_LOCATIONS.vdxfid);
  }
}

const defaultPersonalProfileDataTemplate = [
  new PersonalDataCategory(),
  new ContactDataCategory(),
  new LocationDataCategory()
]

export class PersonalProfileDataStore extends VDXFObject {
  data: { [key: string]: DataCategory };

  constructor(data?: Array<DataCategory>) {
    super(identitykeys.PERSONAL_INFO_OBJECT.vdxfid);
    if (data) {
      this.data = {}
      for (const item of data) {
        this.data[item.category] = item;
      }
    } else {
      this.data = {}
      for (const item of defaultPersonalProfileDataTemplate) {
        this.data[item.category] = item;
      }
    }
  }

  dataByteLength(): number {

    let byteLength = 0;
    byteLength += varuint.encodingLength(Object.keys(this.data).length);

    for (const [key, value] of Object.entries(this.data)) {

      byteLength += HASH160_BYTE_LENGTH; // category
      byteLength += varuint.encodingLength(value.data.length);

      for (const attestation of value.data) {
        byteLength += attestation.toBuffer().length;
      }
    }
    return byteLength;
  }

  toDataBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));

    bufferWriter.writeCompactSize(Object.keys(this.data).length);
    
    for (const [key, value] of Object.entries(this.data)) {

      bufferWriter.writeSlice(fromBase58Check(value.vdxfid).hash);
      bufferWriter.writeCompactSize(value.data.length);

      for (const dataType of value.data) {
        bufferWriter.writeSlice(dataType.toBuffer());
      }
    }
    return bufferWriter.buffer
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new BufferReader(buffer, offset);

    const dataLength = reader.readCompactSize();

    if (!this.data) {
      this.data = {};
    }

    for (var i = 0; i < dataLength; i++) {

      const vdxfkey = toBase58Check(reader.readSlice(HASH160_BYTE_LENGTH), I_ADDR_VERSION);
      const dataLength = reader.readCompactSize();
      const data = []; 

      for (var j = 0; j < dataLength; j++) {

        const attestation = AttestationDataType.getDataItem(toBase58Check(reader.buffer.slice(reader.offset, reader.offset + HASH160_BYTE_LENGTH), I_ADDR_VERSION), null);
        reader.offset = attestation.fromBuffer(reader.buffer, reader.offset);
        data.push(attestation);
      }

      const categoryType = Object.entries(this.data).find(([key, value]) =>  value.vdxfid === vdxfkey );

      this.data[categoryType[1].category].data = data;
    }

    return reader.offset;
  }

  toJson() {
    return {
      data: this.data,
    };
  }
}
