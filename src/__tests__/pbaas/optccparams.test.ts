import { BN } from "bn.js";
import { IdentityID } from "../../pbaas/IdentityID";
import { OptCCParams } from "../../pbaas/OptCCParams";
import { TxDestination } from "../../pbaas/TxDestination";

describe('Serializes and deserializes TxDestination variants', () => {
  test('(de)serialize a basic OptCCParams class to/from a chunk with a tx destination', () => {
    var prevOutDest = 'iQa13cLx5a4bB9nnd8EZPigrqLTsn75VrF'

    const params = new OptCCParams({
      version: new BN(3),
      eval_code: new BN(0),
      m: new BN(1),
      n: new BN(1),
      destinations: [new TxDestination(IdentityID.fromAddress(prevOutDest))]
    })

    const paramFromChunk = OptCCParams.fromChunk(params.toChunk())

    expect(paramFromChunk.toBuffer().toString('hex')).toBe(params.toBuffer().toString('hex'));
  });

  test('(de)serialize a basic OptCCParams class to/from a chunk without a tx destination', () => {
    var prevOutDest = 'iQa13cLx5a4bB9nnd8EZPigrqLTsn75VrF'

    const params = new OptCCParams({
      version: new BN(3),
      eval_code: new BN(0),
      m: new BN(1),
      n: new BN(1),
      destinations: []
    })

    const paramFromChunk = OptCCParams.fromChunk(params.toChunk())

    expect(paramFromChunk.toBuffer().toString('hex')).toBe(params.toBuffer().toString('hex'));
  });

  test('deserialize a valid OptCCParams chunk', () => {
    var optcc = '04030001011504e763c569b60cfc702488e1ff5d8764acd9a56e44';

    const params = OptCCParams.fromChunk(Buffer.from(optcc, 'hex'));

    expect(params.destinations.length).toBe(1);
    expect(params.destinations[0].toAddress()).toBe("iQa13cLx5a4bB9nnd8EZPigrqLTsn75VrF");

    expect(params.vdata.length).toBe(0);

    expect(params.version.toNumber()).toBe(3);
    expect(params.eval_code.toNumber()).toBe(0);
    expect(params.m.toNumber()).toBe(1);
    expect(params.n.toNumber()).toBe(1);

    expect(params.toChunk().toString('hex')).toBe(optcc);
  });

  // test('(de)serialize a basic TxDestination class with type PKH', () => {
  //   var dest = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'
  //   var prevOutDest = 'iQa13cLx5a4bB9nnd8EZPigrqLTsn75VrF'

  //   const prevOutMaster = new OptCCParams({
  //     version: new BN(3),
  //     eval_code: new BN(0),
  //     m: new BN(0),
  //     n: new BN(0)
  //   })
  //   const prevOutParams = new OptCCParams({
  //     version: new BN(3),
  //     eval_code: new BN(0),
  //     m: new BN(1),
  //     n: new BN(1),
  //     destinations: [new TxDestination(IdentityID.fromAddress(prevOutDest))]
  //   })

  //   const prevOutputScript = bscript.compile([
  //     prevOutMaster.toChunk(),
  //     OPS.OP_CHECKCRYPTOCONDITION,
  //     prevOutParams.toChunk(),
  //     OPS.OP_DROP
  //   ])

  //   expect(destFromBuf.toBuffer().toString('hex')).toBe(dest.toBuffer().toString('hex'));
  // });
});