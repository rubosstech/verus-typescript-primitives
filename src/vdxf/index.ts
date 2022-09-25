import { VDXFKeyInterface } from './keys';
export * from './keys'
export * from './scopes'

export interface VDXFObjectInterface {
  vdxfkey: string;
  toString: () => string;
  stringable: () => { [key: string]: any };
}

export interface VerusIDSignatureInterface {
  signature: string;
}

export class VDXFObject implements VDXFObjectInterface {
  vdxfkey: string;
  
  constructor(key: string) {
    this.vdxfkey = key
  }

  stringable() {
    return {}
  }

  toString() {
    return JSON.stringify(this.stringable())
  }
}

export class VerusIDSignature extends VDXFObject {
  signature: string;

  constructor(sig: VerusIDSignatureInterface, vdxfkey: VDXFKeyInterface) {
    super(vdxfkey.vdxfid);
    this.signature = sig.signature;
  }

  stringable() {
    return {
      vdxfkey: this.vdxfkey,
      signature: this.signature,
    };
  }
}