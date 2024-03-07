import bufferutils from "../utils/bufferutils";
import { SerializableEntity } from "../utils/types/SerializableEntity";

export class UnknownID implements SerializableEntity {
  bytes: Buffer;

  constructor(
    bytes: Buffer = Buffer.alloc(0)
  ) {
    this.bytes = bytes;
  }

  getByteLength(): number {
    return this.bytes.length;
  }

  fromBuffer(
    buffer: Buffer,
    offset: number
  ): number {
    const reader = new bufferutils.BufferReader(buffer, offset);

    this.bytes = reader.readVarSlice();

    return reader.offset;
  }
  
  toBuffer(): Buffer {
    const buffer = Buffer.alloc(this.getByteLength());
    const writer = new bufferutils.BufferWriter(buffer);

    writer.writeVarSlice(this.bytes);

    return writer.buffer;
  }
}