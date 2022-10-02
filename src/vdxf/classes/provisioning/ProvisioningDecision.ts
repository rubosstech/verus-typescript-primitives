import bufferutils from "../../../utils/bufferutils";
import varuint from "../../../utils/varuint";
import { Decision } from "../Decision";
import { Context } from "../Context";
import { ProvisioningRequest } from "./ProvisioningRequest";
import {
  LOGIN_CONSENT_PROVISIONING_RESULT_VDXF_KEY,
  LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY,
} from "../../";
import { Hash160 } from "../Hash160";

export class ProvisioningResult extends Context {
  constructor(kv: { [key: string]: string } = {}) {
    super(kv, LOGIN_CONSENT_PROVISIONING_RESULT_VDXF_KEY.vdxfid);
  }
}

export interface ProvisioningDecisionInterface {
  // Decision specific VDXF key
  decision_id: string;

  // String of unix representation of date string
  created_at: number;

  // Random hash string
  salt?: string;

  // VDXF key of error type
  error_key?: string;

  // Error description
  error_desc?: string;

  // Result of provisioning request
  result?: ProvisioningResult;

  // Additional result related information to share with the user
  info_text?: string;

  // Provisioning request
  request: ProvisioningRequest;

  context?: Context;
}

export class ProvisioningDecision
  extends Decision
  implements ProvisioningDecisionInterface
{
  error_key?: string;
  error_desc?: string;
  result?: ProvisioningResult;
  info_text?: string;
  salt?: string;
  request: ProvisioningRequest;

  constructor(
    decision: ProvisioningDecisionInterface = {
      decision_id: "",
      created_at: 0,
      request: new ProvisioningRequest(),
    }
  ) {
    super(
      {
        decision_id: decision.decision_id,
        created_at: decision.created_at,
        salt: decision.salt,
        context: decision.context,
        request: decision.request,
      },
      LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY.vdxfid
    );

    this.error_key = decision.error_key;

    this.error_desc = decision.error_desc;

    this.result = decision.result;

    this.info_text = decision.info_text;

    this.request = new ProvisioningRequest(decision.request)
  }

  dataByteLength(): number {
    const errorKeyLength = this.error_key
      ? Hash160.fromAddress(this.error_key, true).byteLength()
      : Hash160.getEmpty().byteLength();

    const errorDescBuf = Buffer.from(this.error_desc, "utf-8");
    const errorDescLength =
      errorDescBuf.length + varuint.encodingLength(errorDescBuf.length);

    const resultLength = this.result
      ? this.result.byteLength()
      : new ProvisioningResult({}).byteLength();

    const infoTextBuf = Buffer.from(this.info_text, "utf-8");
    const infoTextLength =
      infoTextBuf.length + varuint.encodingLength(infoTextBuf.length);

    return (
      super.dataByteLength() +
      errorKeyLength +
      errorDescLength +
      resultLength +
      infoTextLength
    );
  }

  toDataBuffer(): Buffer {
    const superBuf = super.toDataBuffer();

    const errorKeyBuf = this.error_key
      ? Hash160.fromAddress(this.error_key, true).toBuffer()
      : Hash160.getEmpty().toBuffer();

    const errorDescBuf = Buffer.from(this.error_desc, "utf-8");

    const resultBuf = this.result
      ? this.result.toBuffer()
      : new ProvisioningResult({}).toBuffer();

    const infoTextBuf = Buffer.from(this.info_text, "utf-8");

    const writer = new bufferutils.BufferWriter(
      superBuf,
      super.dataByteLength()
    );

    writer.writeSlice(errorKeyBuf);

    writer.writeVarSlice(errorDescBuf);

    writer.writeSlice(resultBuf);

    writer.writeVarSlice(infoTextBuf);

    return writer.buffer;
  }

  stringable() {
    return {
      vdxfkey: this.vdxfkey,
      decision_id: this.decision_id,
      created_at: this.created_at,
      salt: this.salt,
      error_key: this.error_key,
      error_desc: this.error_desc,
      result: this.result ? this.result.stringable() : null,
      info_text: this.info_text,
      request: this.request.stringable(),
      context: this.context ? this.context.stringable() : null,
    };
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const decision = new Decision();
    let _offset = decision.fromDataBuffer(buffer, offset, false);
    const reader = new bufferutils.BufferReader(buffer, _offset);

    this.request = new ProvisioningRequest()
    reader.offset = this.request.fromBuffer(buffer, _offset)

    const _error_key = new Hash160();
    reader.offset = _error_key.fromBuffer(reader.buffer, true, reader.offset);
    this.error_key = _error_key.toAddress();

    this.error_desc = reader.readVarSlice().toString("utf-8");

    const _result = new ProvisioningResult();
    reader.offset = _result.fromBuffer(reader.buffer, reader.offset);
    this.result = _result;

    this.info_text = reader.readVarSlice().toString("utf-8");

    this.decision_id = decision.decision_id;
    this.created_at = decision.created_at;
    this.salt = decision.salt;
    this.context = decision.context;

    return reader.offset;
  }
}