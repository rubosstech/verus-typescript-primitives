import { Hash160 } from "../vdxf/classes";

export class NoDestination extends Hash160 {
  constructor() {
    super(Buffer.alloc(0), 0, false);
  }

  fromBuffer(buffer: Buffer, varlength?: boolean, offset?: number): number {
    return offset;
  }
}