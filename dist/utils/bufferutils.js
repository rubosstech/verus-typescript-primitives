"use strict";
// The MIT License (MIT)
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseBuffer = exports.writeUInt64LE = exports.readUInt64LE = void 0;
// Copyright (c) 2011-2017 bitcoinjs-lib contributors
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
const varuint_1 = require("./varuint");
// https://github.com/feross/buffer/blob/master/index.js#L1127
function verifuint(value, max) {
    if (typeof value !== "number")
        throw new Error("cannot write a non-number as a number");
    if (value < 0)
        throw new Error("specified a negative value for writing an unsigned value");
    if (value > max)
        throw new Error("RangeError: value out of range");
    if (Math.floor(value) !== value)
        throw new Error("value has a fractional component");
}
const readUInt64LE = (buffer, offset) => {
    const a = buffer.readUInt32LE(offset);
    let b = buffer.readUInt32LE(offset + 4);
    b *= 0x100000000;
    verifuint(b + a, 0x001fffffffffffff);
    return b + a;
};
exports.readUInt64LE = readUInt64LE;
const writeUInt64LE = (buffer, value, offset) => {
    verifuint(value, 0x001fffffffffffff);
    buffer.writeInt32LE(value & -1, offset);
    buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4);
    return offset + 8;
};
exports.writeUInt64LE = writeUInt64LE;
const reverseBuffer = (buffer) => {
    if (buffer.length < 1)
        return buffer;
    let j = buffer.length - 1;
    let tmp = 0;
    for (let i = 0; i < buffer.length / 2; i++) {
        tmp = buffer[i];
        buffer[i] = buffer[j];
        buffer[j] = tmp;
        j--;
    }
    return buffer;
};
exports.reverseBuffer = reverseBuffer;
/**
 * Helper class for serialization of bitcoin data types into a pre-allocated buffer.
 */
class BufferWriter {
    constructor(buffer, offset = 0) {
        this.buffer = buffer;
        this.offset = offset;
    }
    writeUInt8(i) {
        this.offset = this.buffer.writeUInt8(i, this.offset);
    }
    writeUInt16(i) {
        this.offset = this.buffer.writeUInt16LE(i, this.offset);
    }
    writeInt32(i) {
        this.offset = this.buffer.writeInt32LE(i, this.offset);
    }
    writeUInt32(i) {
        this.offset = this.buffer.writeUInt32LE(i, this.offset);
    }
    writeUInt64(i) {
        this.offset = (0, exports.writeUInt64LE)(this.buffer, i, this.offset);
    }
    writeVarInt(i) {
        const encoding = varuint_1.default.encode(i, this.buffer, this.offset);
        this.offset += encoding.bytes;
    }
    writeSlice(slice) {
        if (this.buffer.length < this.offset + slice.length) {
            throw new Error("Cannot write slice out of bounds");
        }
        this.offset += slice.copy(this.buffer, this.offset);
    }
    writeVarSlice(slice) {
        this.writeVarInt(slice.length);
        this.writeSlice(slice);
    }
    writeVector(vector) {
        this.writeVarInt(vector.length);
        vector.forEach((buf) => this.writeVarSlice(buf));
    }
    writeArray(array) {
        this.writeVarInt(array.length);
        array.forEach((buf) => this.writeSlice(buf));
    }
}
/**
 * Helper class for reading of bitcoin data types from a buffer.
 */
class BufferReader {
    constructor(buffer, offset = 0) {
        this.buffer = buffer;
        this.offset = offset;
    }
    readUInt8() {
        const result = this.buffer.readUInt8(this.offset);
        this.offset++;
        return result;
    }
    readInt32() {
        const result = this.buffer.readInt32LE(this.offset);
        this.offset += 4;
        return result;
    }
    readUInt32() {
        const result = this.buffer.readUInt32LE(this.offset);
        this.offset += 4;
        return result;
    }
    readUInt64() {
        const result = (0, exports.readUInt64LE)(this.buffer, this.offset);
        this.offset += 8;
        return result;
    }
    readVarInt() {
        const vi = varuint_1.default.decode(this.buffer, this.offset);
        this.offset += vi.bytes;
        return vi.decoded;
    }
    readSlice(n) {
        if (this.buffer.length < this.offset + n) {
            throw new Error("Cannot read slice out of bounds");
        }
        const result = this.buffer.slice(this.offset, this.offset + n);
        this.offset += n;
        return result;
    }
    readVarSlice() {
        return this.readSlice(this.readVarInt());
    }
    readVector() {
        const count = this.readVarInt();
        const vector = [];
        for (let i = 0; i < count; i++)
            vector.push(this.readVarSlice());
        return vector;
    }
    readArray(sliceLength) {
        const count = this.readVarInt();
        const array = [];
        for (let i = 0; i < count; i++)
            array.push(this.readSlice(sliceLength));
        return array;
    }
}
exports.default = {
    readUInt64LE: exports.readUInt64LE,
    writeUInt64LE: exports.writeUInt64LE,
    reverseBuffer: exports.reverseBuffer,
    BufferWriter,
    BufferReader,
};
