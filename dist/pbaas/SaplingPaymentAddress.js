"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaplingPaymentAddress = void 0;
const bufferutils_1 = require("../utils/bufferutils");
const varuint_1 = require("../utils/varuint");
const sapling_1 = require("../utils/sapling");
const { BufferReader, BufferWriter } = bufferutils_1.default;
class SaplingPaymentAddress {
    constructor(data) {
        if (data != null) {
            if (data.d != null)
                this.d = data.d;
            if (data.pk_d != null)
                this.pk_d = data.pk_d;
        }
    }
    getByteLength() {
        let length = 0;
        length += varuint_1.default.encodingLength(this.d.length);
        length += this.d.length;
        length += this.pk_d.length;
        return length;
    }
    toBuffer() {
        const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));
        writer.writeVarSlice(this.d);
        writer.writeSlice(this.pk_d);
        return writer.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        this.d = reader.readVarSlice();
        this.pk_d = reader.readSlice(32);
        return reader.offset;
    }
    static fromAddressString(address) {
        throw new Error("Sapling payment addresses not decodable yet");
        const { d, pk_d } = (0, sapling_1.decodeSaplingAddress)(address);
        return new SaplingPaymentAddress({ d, pk_d });
    }
}
exports.SaplingPaymentAddress = SaplingPaymentAddress;
