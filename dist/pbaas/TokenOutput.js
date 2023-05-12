"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION_MULTIVALUE = exports.VERSION_LASTVALID = exports.VERSION_FIRSTVALID = exports.VERSION_CURRENT = void 0;
const CurrencyValueMap_1 = require("./CurrencyValueMap");
const varint_1 = require("../utils/varint");
const bufferutils_1 = require("../utils/bufferutils");
const bn_js_1 = require("bn.js");
const { BufferReader, BufferWriter } = bufferutils_1.default;
// const VERSION_INVALID = 0
exports.VERSION_CURRENT = new bn_js_1.BN(1, 10);
exports.VERSION_FIRSTVALID = new bn_js_1.BN(1, 10);
exports.VERSION_LASTVALID = new bn_js_1.BN(1, 10);
exports.VERSION_MULTIVALUE = new bn_js_1.BN('80000000', 16);
class TokenOutput {
    constructor(data) {
        this.version = exports.VERSION_CURRENT;
        this.reserve_values = new CurrencyValueMap_1.default();
        if (data != null) {
            if (data.values != null)
                this.reserve_values = data.values;
            if (data.version != null)
                this.version = data.version;
        }
    }
    toBuffer() {
        const multivalue = !!(this.version.and(exports.VERSION_MULTIVALUE).toNumber());
        if (multivalue) {
            this.reserve_values.multivalue = true;
        }
        const serializedSize = varint_1.default.encodingLength(this.version) + this.reserve_values.getByteLength();
        const writer = new BufferWriter(Buffer.alloc(serializedSize));
        writer.writeVarInt(this.version);
        writer.writeSlice(this.reserve_values.toBuffer());
        return writer.buffer;
    }
    fromBuffer(buffer) {
        const reader = new BufferReader(buffer);
        this.version = reader.readVarInt();
        const multivalue = !!(this.version.and(exports.VERSION_MULTIVALUE).toNumber());
        this.reserve_values = new CurrencyValueMap_1.default({ multivalue });
        this.reserve_values.fromBuffer(reader.buffer, reader.offset);
    }
    firstCurrency() {
        const iterator = this.reserve_values.value_map.entries().next();
        return iterator.done ? null : iterator.value[0];
    }
    firstValue() {
        const iterator = this.reserve_values.value_map.entries().next();
        return iterator.done ? null : iterator.value[1];
    }
    getVersion() {
        return this.version;
    }
    isValid() {
        return (this.version.gte(exports.VERSION_FIRSTVALID) &&
            this.version.lte(exports.VERSION_LASTVALID));
    }
}
exports.default = TokenOutput;
