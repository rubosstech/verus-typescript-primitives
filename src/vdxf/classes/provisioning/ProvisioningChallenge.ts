import bufferutils from "../../../utils/bufferutils";
import varuint from "../../../utils/varuint";
import { LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY } from "../../keys";
import { Challenge } from "../Challenge";
import { Context } from "../Context";

export interface ProvisioningChallengeInterface {
  // Challenge specific VDXF key
  challenge_id: string;

  // String of unix representation of date string
  created_at: number;

  // Random hash string
  salt?: string;

  // Optional name of verusid to provision
  name?: string;

  context?: Context;
}

export class ProvisioningChallenge extends Challenge {
  name?: string;

  constructor(
    challenge: ProvisioningChallengeInterface = { challenge_id: "", created_at: 0 }
  ) {
    super(
      {
        challenge_id: challenge.challenge_id,
        created_at: challenge.created_at,
        salt: challenge.salt,
        context: challenge.context,
      },
      LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY.vdxfid
    );

    this.name = challenge.name
  }

  dataByteLength(): number {
    const nameBuf = Buffer.from(this.name, 'utf-8')
    let length = 0

    length += nameBuf.length
    length += varuint.encodingLength(nameBuf.length)

    return super.dataByteLength() + length
  }

  toDataBuffer(): Buffer {
    const superBuf = super.toDataBuffer()
    const writer = new bufferutils.BufferWriter(superBuf, super.dataByteLength())

    writer.writeVarSlice(Buffer.from(this.name, 'utf-8'))

    return writer.buffer
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const challenge = new Challenge(undefined, LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY.vdxfid)
    let _offset = challenge.fromDataBuffer(buffer, offset);
    const reader = new bufferutils.BufferReader(buffer, _offset)

    this.name = reader.readVarSlice().toString('utf-8')
    this.challenge_id = challenge.challenge_id
    this.created_at = challenge.created_at
    this.salt = challenge.salt
    this.context = challenge.context

    return reader.offset
  }
}