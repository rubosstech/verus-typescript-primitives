"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxDestination = void 0;
const bn_js_1 = require("bn.js");
const NoDestination_1 = require("./NoDestination");
const varuint_1 = require("../utils/varuint");
const bufferutils_1 = require("../utils/bufferutils");
const { BufferReader, BufferWriter } = bufferutils_1.default;
class TxDestination {
    constructor(data = new NoDestination_1.NoDestination(), type = TxDestination.TYPE_PKH) {
        this.data = data;
        this.type = type;
    }
    getByteLength() {
        if (this.type.eq(TxDestination.TYPE_PKH))
            return 21;
        else if (this.type.eq(TxDestination.TYPE_PK))
            return 34;
        else {
            const datalen = this.data.getByteLength();
            return varuint_1.default.encodingLength(datalen) + datalen;
        }
    }
}
exports.TxDestination = TxDestination;
TxDestination.TYPE_INVALID = new bn_js_1.BN(0, 10);
TxDestination.TYPE_PK = new bn_js_1.BN(1, 10);
TxDestination.TYPE_PKH = new bn_js_1.BN(2, 10);
TxDestination.TYPE_SH = new bn_js_1.BN(3, 10);
TxDestination.TYPE_ID = new bn_js_1.BN(4, 10);
TxDestination.TYPE_INDEX = new bn_js_1.BN(5, 10);
TxDestination.TYPE_QUANTUM = new bn_js_1.BN(6, 10);
TxDestination.TYPE_LAST = new bn_js_1.BN(6, 10);
