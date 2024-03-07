import { R_ADDR_VERSION } from '../constants/vdxf';
import { Hash160 } from '../vdxf/classes';

export class KeyID extends Hash160 {
  constructor(
    hash: Buffer = Buffer.alloc(0)
  ) {
    super(hash, R_ADDR_VERSION, false);
  }

  fromBuffer(buffer: Buffer, varlength?: boolean, offset?: number): number {
    const ret = super.fromBuffer(buffer, varlength, offset);

    this.version = R_ADDR_VERSION;
    
    return ret;
  }
}