import { VDXFObject } from "../..";
import bufferutils, { reverseBuffer } from "../../../utils/bufferutils";
import varuint from "../../../utils/varuint";
import { LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY, LOGIN_CONSENT_PROVISIONING_RESULT_VDXF_KEY } from "../../keys";
import { Challenge } from "../Challenge";
import { Hash160 } from "../Hash160";

export interface ProvisioningResultInterface {
  // Vdfxkey representing the result state
  state: string;

  // VDXF key of error type
  error_key?: string;

  // Error description
  error_desc?: string;

  // Identity address provisioned (if applicable)
  identity_address?: string;

  // Uri used to fetch more info about result (if applicable)
  info_uri?: string;

  // Txid of name reservation (if applicable)
  reservation_txid?: string;

  // Txid of ID creation or ID transfer (if applicable)
  provisioning_txid?: string;
}

export class ProvisioningResult extends VDXFObject {
  state: string;
  error_key?: string;
  error_desc?: string;
  identity_address?: string;
  info_uri?: string;
  reservation_txid?: string;
  provisioning_txid?: string;

  constructor(
    result: ProvisioningResultInterface = { state: "" }
  ) {
    super(LOGIN_CONSENT_PROVISIONING_RESULT_VDXF_KEY.vdxfid);

    this.state = result.state
    this.error_desc = result.error_desc
    this.error_key = result.error_key
    this.identity_address = result.identity_address
    this.info_uri = result.info_uri
    this.reservation_txid = result.reservation_txid
    this.provisioning_txid = result.provisioning_txid
  }

  dataByteLength(): number {
    const stateLength = Hash160.fromAddress(this.state).byteLength()

    const errorKeyLength = this.error_key
      ? Hash160.fromAddress(this.error_key, true).byteLength()
      : Hash160.getEmpty().byteLength();

    const errorDescBuf =
      this.error_desc == null
        ? Buffer.alloc(0)
        : Buffer.from(this.error_desc, "utf-8");
    const errorDescLength =
      errorDescBuf.length + varuint.encodingLength(errorDescBuf.length);

    const idAddrLength = this.identity_address
      ? Hash160.fromAddress(this.identity_address, true).byteLength()
      : Hash160.getEmpty().byteLength();

    const infoUriBuf = this.info_uri == null ? Buffer.alloc(0) : Buffer.from(this.info_uri, "utf-8");
    const infoUriLength =
      infoUriBuf.length + varuint.encodingLength(infoUriBuf.length);

    const reservationTxidBuf =
      this.reservation_txid == null
        ? Buffer.alloc(0)
        : Buffer.from(this.reservation_txid, "hex");
    const reservationTxidLength = reservationTxidBuf.length + varuint.encodingLength(reservationTxidBuf.length);

    const provisioningTxidBuf =
      this.provisioning_txid == null
        ? Buffer.alloc(0)
        : Buffer.from(this.provisioning_txid, "hex");
    const provisioningTxidLength = provisioningTxidBuf.length + varuint.encodingLength(provisioningTxidBuf.length);

    return (
      stateLength +
      errorKeyLength +
      errorDescLength +
      idAddrLength +
      infoUriLength +
      reservationTxidLength +
      provisioningTxidLength
    );
  }

  toDataBuffer(): Buffer {
    const writer = new bufferutils.BufferWriter(Buffer.alloc(this.dataByteLength()))

    writer.writeSlice(Hash160.fromAddress(this.state).toBuffer());
    
    writer.writeSlice(
      this.error_key
        ? Hash160.fromAddress(this.error_key, true).toBuffer()
        : Hash160.getEmpty().toBuffer()
    );
  
    writer.writeVarSlice(this.error_desc == null ? Buffer.alloc(0) : Buffer.from(this.error_desc, "utf-8"));

    writer.writeSlice(
      this.identity_address
        ? Hash160.fromAddress(this.identity_address, true).toBuffer()
        : Hash160.getEmpty().toBuffer()
    );

    writer.writeVarSlice(this.info_uri == null ? Buffer.alloc(0) : Buffer.from(this.info_uri, "utf-8"));

    writer.writeVarSlice(
      this.reservation_txid == null
        ? Buffer.alloc(0)
        : reverseBuffer(Buffer.from(this.reservation_txid, "hex"))
    );

    writer.writeVarSlice(
      this.provisioning_txid == null
        ? Buffer.alloc(0)
        : reverseBuffer(Buffer.from(this.provisioning_txid, "hex"))
    );

    return writer.buffer
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);
    const resultLength = reader.readVarInt();

    if (resultLength == 0) {
      throw new Error("Cannot create provisioning result from empty buffer");
    } else {
      const _state = new Hash160();
      reader.offset = _state.fromBuffer(
        reader.buffer,
        false,
        reader.offset
      );
      this.state = _state.toAddress();

      const _error_key = new Hash160();
      reader.offset = _error_key.fromBuffer(
        reader.buffer,
        true,
        reader.offset
      );
      this.error_key = _error_key.toAddress();

      this.error_desc = reader.readVarSlice().toString('utf8')

      const _identity_address = new Hash160();
      reader.offset = _identity_address.fromBuffer(
        reader.buffer,
        true,
        reader.offset
      );
      this.identity_address = _identity_address.toAddress();

      this.info_uri = reader.readVarSlice().toString('utf8')

      const reservationTxidSlice = reader.readVarSlice()
      const reservationTxidBuf = Buffer.alloc(reservationTxidSlice.length)
      const reservationTxidWriter = new bufferutils.BufferWriter(reservationTxidBuf)
      reservationTxidWriter.writeSlice(reservationTxidSlice)
      this.reservation_txid = reverseBuffer(reservationTxidWriter.buffer).toString('hex')

      const provisioningTxidSlice = reader.readVarSlice()
      const provisioningTxidBuf = Buffer.alloc(provisioningTxidSlice.length)
      const provisioningTxidWriter = new bufferutils.BufferWriter(provisioningTxidBuf)
      provisioningTxidWriter.writeSlice(provisioningTxidSlice)
      this.provisioning_txid = reverseBuffer(provisioningTxidWriter.buffer).toString('hex')
    }

    return reader.offset;
  }
}