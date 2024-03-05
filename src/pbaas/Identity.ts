import varuint from '../utils/varuint'
import bufferutils from '../utils/bufferutils'
import { BigNumber } from '../utils/types/BigNumber';
import { Principal } from './Principal';
import { fromBase58Check, toBase58Check } from '../utils/address';
import { I_ADDR_VERSION } from '../constants/vdxf';
import { BN } from 'bn.js';
import { IdentityID } from './IdentityID';
import { SaplingPaymentAddress } from './SaplingPaymentAddress';
import { TxDestination } from './TxDestination';
import { ContentMultiMap } from './ContentMultiMap';

export const IDENTITY_VERSION_PBAAS = new BN(3, 10);
export const IDENITTY_VERSION_INVALID = new BN(0, 10);

export const IDENTITY_FLAG_REVOKED = new BN(8000, 16);          // set when this identity is revoked
export const IDENTITY_FLAG_ACTIVECURRENCY = new BN(1, 16);      // flag that is set when this ID is being used as an active currency name
export const IDENTITY_FLAG_LOCKED = new BN(2, 16);              // set when this identity is locked
export const IDENTITY_FLAG_TOKENIZED_CONTROL = new BN(4, 16);   // set when revocation/recovery over this identity can be performed by anyone who controls its token
export const IDENTITY_MAX_UNLOCK_DELAY = new BN(60).mul(new BN(24)).mul(new BN(22)).mul(new BN(365));        // 21+ year maximum unlock time for an ID w/1 minute blocks, not adjusted for avg blocktime in first PBaaS
export const IDENTITY_MAX_NAME_LEN = new BN(64);

const { BufferReader, BufferWriter } = bufferutils

export type Hashes = Map<string, Buffer>;
export type KvContent =  Map<string, Array<Buffer>>;

export class Identity extends Principal {
  parent: IdentityID;
  system_id: IdentityID;
  name: string;
  content_map: Hashes;
  content_multimap: ContentMultiMap;
  revocation_authority: IdentityID;
  recovery_authority: IdentityID;
  private_addresses: Array<SaplingPaymentAddress>;
  unlock_after: BigNumber;

  constructor(data?: {
    version?: BigNumber;
    flags?: BigNumber;
    min_sigs?: BigNumber;
    primary_addresses?: Array<TxDestination>;
    parent?: IdentityID;
    system_id?: IdentityID;
    name?: string;
    content_map?: Hashes;
    content_multimap?: ContentMultiMap;
    revocation_authority?: IdentityID;
    recovery_authority?: IdentityID;
    private_addresses?: Array<SaplingPaymentAddress>;
    unlock_after?: BigNumber;
  }) {
    super(data)

    if (data?.parent) this.parent = data.parent;
    if (data?.system_id) this.system_id = data.system_id;
    if (data?.name) this.name = data.name;
    if (data?.content_map) this.content_map = data.content_map;
    if (data?.content_multimap) this.content_multimap = data.content_multimap;
    if (data?.revocation_authority) this.revocation_authority = data.revocation_authority;
    if (data?.recovery_authority) this.recovery_authority = data.recovery_authority;
    if (data?.private_addresses) this.private_addresses = data.private_addresses;
    if (data?.unlock_after) this.unlock_after = data.unlock_after;
  }

  getByteLength() {
    let length = 0;

    length += super.getByteLength();
    length += this.parent.byteLength();

    const nameLength = Buffer.from(this.name, "utf8").length;
    length += varuint.encodingLength(nameLength);
    length += nameLength;

    if (this.version.gte(IDENTITY_VERSION_PBAAS) && this.content_multimap) {
      length += this.content_multimap.getByteLength();
    }

    if (this.version.lt(IDENTITY_VERSION_PBAAS)) {
      length += varuint.encodingLength(this.content_map.size);

      for (const m in this.content_map) {
        length += 20;   //uint160 key
        length += 32;   //uint256 hash
      }
    }

    length += varuint.encodingLength(this.content_map.size);

    for (const m in this.content_map) {
      length += 20;   //uint160 key
      length += 32;   //uint256 hash
    }

    length += this.revocation_authority.byteLength();   //uint160 revocation authority
    length += this.recovery_authority.byteLength();   //uint160 recovery authority

    // privateaddresses
    length += varuint.encodingLength(this.private_addresses ? this.private_addresses.length : 0);

    if (this.private_addresses) {
      for (const n of this.private_addresses) {
        n.getByteLength();
      }
    }

    // post PBAAS
    if (this.version.gte(IDENTITY_VERSION_PBAAS)) {
      length += this.system_id.byteLength();   //uint160 systemid
      length += 4;                             //uint32 unlockafter
    }

    return length;
  }

  toBuffer() {
    const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));

    writer.writeSlice(super.toBuffer());
    writer.writeSlice(this.parent.toBuffer());

    writer.writeVarSlice(Buffer.from(this.name, "utf8"));

    //contentmultimap
    if (this.version.gte(IDENTITY_VERSION_PBAAS) && this.content_multimap) {
      writer.writeSlice(this.content_multimap.toBuffer());
    }

    //contentmap
    if (this.version.lt(IDENTITY_VERSION_PBAAS)) {
      writer.writeCompactSize(this.content_map.size);

      for (const [key, value] of this.content_map.entries()) {
        writer.writeSlice(fromBase58Check(key).hash);
        writer.writeSlice(value);
      }
    }

    //contentmap2
    writer.writeCompactSize(this.content_map.size);

    for (const [key, value] of this.content_map.entries()) {
      writer.writeSlice(fromBase58Check(key).hash);
      writer.writeSlice(value);
    }

    writer.writeSlice(this.revocation_authority.toBuffer());
    writer.writeSlice(this.recovery_authority.toBuffer());

    // privateaddresses
    writer.writeCompactSize(this.private_addresses.length);

    if (this.private_addresses) {
      for (const n of this.private_addresses) {
        writer.writeSlice(n.toBuffer());
      }
    }
    
    // post PBAAS
    if (this.version.gte(IDENTITY_VERSION_PBAAS)) {
      writer.writeSlice(this.system_id.toBuffer())
      writer.writeUInt32(this.unlock_after.toNumber())
    }

    return writer.buffer
  }

  fromBuffer(buffer, offset: number = 0) {
    const reader = new BufferReader(buffer, offset);

    reader.offset = super.fromBuffer(reader.buffer, reader.offset);

    const _parent = new IdentityID();
    reader.offset = _parent.fromBuffer(
      reader.buffer,
      false,
      reader.offset
    );
    this.parent = _parent;

    this.name = Buffer.from(reader.readVarSlice()).toString('utf8')

    //contentmultimap
    if (this.version.gte(IDENTITY_VERSION_PBAAS)) {
      const multimap = new ContentMultiMap();

      reader.offset = multimap.fromBuffer(reader.buffer, reader.offset);

      this.content_multimap = multimap;
    }

    // contentmap
    if (this.version.lt(IDENTITY_VERSION_PBAAS)) {
      const contentMapSize = reader.readVarInt();
      this.content_map = new Map();

      for (var i = 0; i < contentMapSize.toNumber(); i++) {
        const contentMapKey = toBase58Check(reader.readSlice(20), I_ADDR_VERSION)
        this.content_map.set(contentMapKey, reader.readSlice(32));
      }
    }

    const contentMapSize = reader.readVarInt();
    this.content_map = new Map();

    for (var i = 0; i < contentMapSize.toNumber(); i++) {
      const contentMapKey = toBase58Check(reader.readSlice(20), I_ADDR_VERSION)
      this.content_map.set(contentMapKey, reader.readSlice(32));
    }

    const _revocation = new IdentityID();
    reader.offset = _revocation.fromBuffer(
      reader.buffer,
      false,
      reader.offset
    );
    this.revocation_authority = _revocation;

    const _recovery = new IdentityID();
    reader.offset = _recovery.fromBuffer(
      reader.buffer,
      false,
      reader.offset
    );
    this.recovery_authority = _recovery;

    const numPrivateAddresses = reader.readVarInt();

    for (var i = 0; i < numPrivateAddresses.toNumber(); i++) {
      const saplingAddr = new SaplingPaymentAddress();
      reader.offset = saplingAddr.fromBuffer(
        reader.buffer,
        reader.offset
      );
      this.private_addresses.push(saplingAddr);
    }

    if (this.version.gte(IDENTITY_VERSION_PBAAS)) {
      const _system = new IdentityID();
      reader.offset = _system.fromBuffer(
        reader.buffer,
        false,
        reader.offset
      );
      this.system_id = _system;

      this.unlock_after = new BN(reader.readUInt32(), 10);
    }

    return reader.offset;
  }
}