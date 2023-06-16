import varuint from '../utils/varuint'
import bufferutils from '../utils/bufferutils'
import { fromBase58Check, toBase58Check } from '../utils/address';
import { R_ADDR_VERSION } from '../constants/vdxf';
import { BN } from 'bn.js';

const { BufferReader, BufferWriter } = bufferutils

export class TxDestination {
    primary_addresses: Array<Buffer>;

    constructor(data: { primary_addresses?: Array<string> } = {}) {

        for (const tempAddr of data.primary_addresses) {

            let tempDecoded;
            try {
                let tempRaddress = fromBase58Check(tempAddr)
                tempDecoded = tempRaddress.hash
                if (tempDecoded.length != 20 || tempRaddress.version != R_ADDR_VERSION)
                    throw new Error("Incorrect hex length of pub key")
            } catch (e) {
                tempDecoded = Buffer.from(tempAddr, 'hex')
                if (tempDecoded.length != 33)
                    throw new Error("Incorrect hex length of pub key")
            }
            this.primary_addresses.push(tempDecoded)
        }
    }

    getNumValues() {
        return new BN(this.primary_addresses.length, 10)
    }

    getAddressString() {
        let retval = [];

        for (const addr of this.primary_addresses)

            if (addr.length == 20) {
                retval.push(toBase58Check(addr, R_ADDR_VERSION));
            }
            else if (addr.length == 33) {
                retval.push(addr.toString('hex'));
            }
            else {
                retval.push("");
            }
    }

    getByteLength() {
        let byteLength = 0;

        byteLength += varuint.encodingLength(this.primary_addresses.length);

        for (const txDest of this.primary_addresses) {
            byteLength += varuint.encodingLength(txDest.length);
            byteLength += txDest.length;
        }

        return byteLength
    }

    toBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()))

        bufferWriter.writeVarInt(new BN(this.primary_addresses.length))
        bufferWriter.writeVector(this.primary_addresses);

        return bufferWriter.buffer
    }

    fromBuffer(buffer, offset: number = 0) {
        const reader = new BufferReader(buffer, offset);
        let count: number;

        count = reader.readVarInt().toNumber();

        for (let i = 0; i < count; i++) {
            this.primary_addresses[i] = reader.readVarSlice();
        }

        return reader.offset;
    }
}