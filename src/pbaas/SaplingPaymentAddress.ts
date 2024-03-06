import bufferutils from '../utils/bufferutils';
import { decodeSaplingAddress } from '../utils/sapling';

const { BufferReader, BufferWriter } = bufferutils

export class SaplingPaymentAddress {
  d: Buffer;
  pk_d: Buffer

  constructor(data?: {
    d: Buffer,
    pk_d: Buffer
  }) {
    if (data != null) {
      if (data.d != null) this.d = data.d;
      if (data.pk_d != null) this.pk_d = data.pk_d;
    }
  }

  getByteLength() {
    let length = 0;

    length += this.d.length;
    length += this.pk_d.length;

    return length
  }

  toBuffer() {
    const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));

    writer.writeSlice(this.d);
    writer.writeSlice(this.pk_d);

    return writer.buffer;
  }

  fromBuffer(buffer: Buffer, offset: number = 0) {
    const reader = new BufferReader(buffer, offset);

    this.d = reader.readSlice(11);
    this.pk_d = reader.readSlice(32);

    return reader.offset;
  }

  static fromAddressString(address: string) {
    throw new Error("Sapling payment addresses not decodable yet")

    const { d, pk_d } = decodeSaplingAddress(address);

    return new SaplingPaymentAddress({ d, pk_d });
  }
}