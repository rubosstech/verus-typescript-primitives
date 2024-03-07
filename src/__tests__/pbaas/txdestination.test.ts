import { IdentityID } from "../../pbaas/IdentityID";
import { KeyID } from "../../pbaas/KeyID";
import { NoDestination } from "../../pbaas/NoDestination";
import { TxDestinationInterface } from "../../pbaas/TxDestination";
import { fromBase58Check, toIAddress } from "../../utils/address";

describe('Serializes and deserializes TxDestination(s)', () => {
  function testTxDestinationType(TxDestClass: TxDestinationInterface, addr?: string) {
    const hash = addr ? fromBase58Check(addr).hash : undefined;

    const id = new TxDestClass(hash);
    const idFromBuf = new TxDestClass();
    idFromBuf.fromBuffer(id.toBuffer());

    expect(id.toBuffer().toString('hex')).toBe(hash ? hash.toString('hex') : "");
    expect(id.toAddress()).toBe(addr ? addr : null);
    expect(idFromBuf.toAddress()).toBe(id.toAddress());
    expect(idFromBuf.toBuffer().toString('hex')).toBe(id.toBuffer().toString('hex'));
  }

  test('(de)serialize an IdentityID', () => {
    const vrsctest = "VRSCTEST";
    const addr = toIAddress(vrsctest);

    testTxDestinationType(IdentityID, addr)
  });

  test('(de)serialize a KeyID', () => {
    testTxDestinationType(KeyID, "RQVsJRf98iq8YmRQdehzRcbLGHEx6YfjdH")
  });

  test('(de)serialize a NoDestination', () => {
    testTxDestinationType(NoDestination, "")
  });
});