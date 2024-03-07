import { BN } from 'bn.js';
import { BigNumber } from '../utils/types/BigNumber';
import { IdentityID } from './IdentityID';
import { KeyID } from './KeyID';
import { NoDestination } from './NoDestination';
import varuint from '../utils/varuint';

import bufferutils from '../utils/bufferutils';
import { PubKey } from './PubKey';
const { BufferReader, BufferWriter } = bufferutils;

export interface TxDestinationVariantInterface {
  new (hash?: Buffer): TxDestinationVariant;
}

// Add support for CNoDestination, CPubKey, CScriptID, CIndexID, CQuantumID
export type TxDestinationVariant = IdentityID | KeyID | NoDestination | PubKey;

export class TxDestination {
  type: BigNumber;
  data: TxDestinationVariant;

  static TYPE_INVALID = new BN(0, 10);
  static TYPE_PK = new BN(1, 10);
  static TYPE_PKH = new BN(2, 10);
  static TYPE_SH = new BN(3, 10);
  static TYPE_ID = new BN(4, 10);
  static TYPE_INDEX = new BN(5, 10);
  static TYPE_QUANTUM = new BN(6, 10);
  static TYPE_LAST = new BN(6, 10);

  constructor(data: TxDestinationVariant = new NoDestination(), type: BigNumber = TxDestination.TYPE_PKH) {
    this.data = data;
    this.type = type;
  }
  
  getByteLength(): number {
    if (this.type.eq(TxDestination.TYPE_PKH)) return 21
    else if (this.type.eq(TxDestination.TYPE_PK)) return 34
    else {
      const datalen = this.data.getByteLength();

      return varuint.encodingLength(datalen) + datalen;
    }
  }

  // fromBuffer(buffer: Buffer, offset: number = 0): number {
  //   const reader = new BufferReader(buffer, offset);

  //   const destBytes = reader.readVarSlice();

  //   if (destBytes.length === 20) {
  //     this.type = TxDestination.TYPE_PKH;
  //     this.data = new KeyID(destBytes);
  //   } else if (destBytes.length === 33) {
  //     this.type = TxDestination.TYPE_PK;
  //     this.data = new KeyID(destBytes);
  //   }
  // }

  // toBuffer(): Buffer {
    
  // }
}