import { I_ADDR_VERSION } from '../constants/vdxf';
import { Hash160 } from '../vdxf/classes';

export class IdentityID extends Hash160 {
  constructor(
    hash: Buffer = Buffer.alloc(0)
  ) {
    super(hash, I_ADDR_VERSION, false);
  }
}