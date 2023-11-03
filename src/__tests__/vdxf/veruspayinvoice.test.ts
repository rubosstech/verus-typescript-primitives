import { BN } from "bn.js";
import { VerusPayInvoice, VerusPayInvoiceDetails } from "../../vdxf/classes";
import { DEST_PKH, TransferDestination } from "../../pbaas/TransferDestination";
import { fromBase58Check } from "../../utils/address";

describe('Serializes and deserializes VerusPay invoice', () => {
  test('basic verus pay invoice without signature', async () => {
    const details = new VerusPayInvoiceDetails({
      amount: new BN(10000000000, 10),
      destination: new TransferDestination({
        type: DEST_PKH,
        destination_bytes: fromBase58Check("R9J8E2no2HVjQmzX6Ntes2ShSGcn7WiRcx").hash
      }),
      requestedcurrencyid: "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq"
    })

    const inv = new VerusPayInvoice({
      details
    })

    const invbuf = inv.toBuffer()
    const _inv = new VerusPayInvoice()
    _inv.fromBuffer(invbuf)

    expect(_inv.toBuffer().toString('hex')).toBe(invbuf.toString('hex'));

    const invuri = inv.toWalletDeeplinkUri()
    const _invfromuri = VerusPayInvoice.fromWalletDeeplinkUri(invuri)

    expect(_invfromuri.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));

    const invqrstring = inv.toQrString()
    const _invfromqrstring = VerusPayInvoice.fromQrString(invqrstring)

    expect(_invfromqrstring.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));
  });

  test('verus pay invoice without signature that accepts conversion', async () => {
    const details = new VerusPayInvoiceDetails({
      amount: new BN(10000000000, 10),
      destination: new TransferDestination({
        type: DEST_PKH,
        destination_bytes: fromBase58Check("R9J8E2no2HVjQmzX6Ntes2ShSGcn7WiRcx").hash
      }),
      requestedcurrencyid: "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      mindestcurrencyinreserve: new BN(250000000000, 10),
      minsourcedestweightratio: new BN(40000000, 10),
    })

    details.setFlags({
      acceptsConversion: true
    })

    const inv = new VerusPayInvoice({
      details
    })

    const invbuf = inv.toBuffer()
    const _inv = new VerusPayInvoice()
    _inv.fromBuffer(invbuf)

    expect(_inv.toBuffer().toString('hex')).toBe(invbuf.toString('hex'));

    const invuri = inv.toWalletDeeplinkUri()
    const _invfromuri = VerusPayInvoice.fromWalletDeeplinkUri(invuri)

    expect(_invfromuri.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));

    const invqrstring = inv.toQrString()
    const _invfromqrstring = VerusPayInvoice.fromQrString(invqrstring)

    expect(_invfromqrstring.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));
  });

  test('verus pay invoice without signature that accepts conversion and expires', async () => {
    const details = new VerusPayInvoiceDetails({
      amount: new BN(10000000000, 10),
      destination: new TransferDestination({
        type: DEST_PKH,
        destination_bytes: fromBase58Check("R9J8E2no2HVjQmzX6Ntes2ShSGcn7WiRcx").hash
      }),
      requestedcurrencyid: "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      mindestcurrencyinreserve: new BN(250000000000, 10),
      minsourcedestweightratio: new BN(40000000, 10),
      expiryheight: new BN(2000000, 10)
    })

    details.setFlags({
      acceptsConversion: true,
      expires: true
    })

    const inv = new VerusPayInvoice({
      details
    })

    const invbuf = inv.toBuffer()
    const _inv = new VerusPayInvoice()
    _inv.fromBuffer(invbuf)

    expect(_inv.toBuffer().toString('hex')).toBe(invbuf.toString('hex'));

    const invuri = inv.toWalletDeeplinkUri()
    const _invfromuri = VerusPayInvoice.fromWalletDeeplinkUri(invuri)

    expect(_invfromuri.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));

    const invqrstring = inv.toQrString()
    const _invfromqrstring = VerusPayInvoice.fromQrString(invqrstring)

    expect(_invfromqrstring.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));
  });

  test('verus pay invoice without signature that accepts conversion on 2 non-verus systems and expires', async () => {
    const details = new VerusPayInvoiceDetails({
      amount: new BN(10000000000, 10),
      destination: new TransferDestination({
        type: DEST_PKH,
        destination_bytes: fromBase58Check("R9J8E2no2HVjQmzX6Ntes2ShSGcn7WiRcx").hash
      }),
      requestedcurrencyid: "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      mindestcurrencyinreserve: new BN(250000000000, 10),
      minsourcedestweightratio: new BN(40000000, 10),
      expiryheight: new BN(2000000, 10),
      acceptedsystems: ["iNC9NG5Jqk2tqVtqfjfiSpaqxrXaFU6RDu", "iBDkVJqik6BrtcDBQfFygffiYzTMy6EuhU"]
    })

    details.setFlags({
      acceptsConversion: true,
      expires: true,
      acceptsNonVerusSystems: true
    })

    const inv = new VerusPayInvoice({
      details
    })

    const invbuf = inv.toBuffer()
    const _inv = new VerusPayInvoice()
    _inv.fromBuffer(invbuf)

    expect(_inv.toBuffer().toString('hex')).toBe(invbuf.toString('hex'));

    const invuri = inv.toWalletDeeplinkUri()
    const _invfromuri = VerusPayInvoice.fromWalletDeeplinkUri(invuri)

    expect(_invfromuri.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));

    const invqrstring = inv.toQrString()
    const _invfromqrstring = VerusPayInvoice.fromQrString(invqrstring)

    expect(_invfromqrstring.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));
  });

  test('verus pay invoice with signature that accepts conversion on 2 non-verus systems and expires', async () => {
    const details = new VerusPayInvoiceDetails({
      amount: new BN(10000000000, 10),
      destination: new TransferDestination({
        type: DEST_PKH,
        destination_bytes: fromBase58Check("R9J8E2no2HVjQmzX6Ntes2ShSGcn7WiRcx").hash
      }),
      requestedcurrencyid: "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      mindestcurrencyinreserve: new BN(250000000000, 10),
      minsourcedestweightratio: new BN(40000000, 10),
      expiryheight: new BN(2000000, 10),
      acceptedsystems: ["iNC9NG5Jqk2tqVtqfjfiSpaqxrXaFU6RDu", "iBDkVJqik6BrtcDBQfFygffiYzTMy6EuhU"]
    })

    details.setFlags({
      acceptsConversion: true,
      expires: true,
      acceptsNonVerusSystems: true
    })

    const inv = new VerusPayInvoice({
      details,
      system_id: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      signing_id: "iB5PRXMHLYcNtM8dfLB6KwfJrHU2mKDYuU",
      signature: {
        signature:
          "AYG2IQABQSAN1fp6A9NIVbxvKuOVLLU+0I+G3oQGbRtS6u4Eampfb217Cdf5FCMScQhV9kMxtjI9GWzpchmjuiTB2tctk6qT",
      },
    })

    inv.setSigned()

    const invbuf = inv.toBuffer()
    const _inv = new VerusPayInvoice()
    _inv.fromBuffer(invbuf)

    expect(_inv.toBuffer().toString('hex')).toBe(invbuf.toString('hex'));

    const invuri = inv.toWalletDeeplinkUri()
    const _invfromuri = VerusPayInvoice.fromWalletDeeplinkUri(invuri)

    expect(_invfromuri.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));

    const invqrstring = inv.toQrString()
    const _invfromqrstring = VerusPayInvoice.fromQrString(invqrstring)

    expect(_invfromqrstring.toBuffer().toString('hex')).toBe(inv.toBuffer().toString('hex'));
  });
});
