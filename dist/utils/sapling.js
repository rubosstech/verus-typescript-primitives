"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSaplingAddress = exports.convertBits = exports.fromBech32 = void 0;
const bech32_1 = require("bech32");
// TODO: Fix this function, it doesn't decode sapling addrs
const fromBech32 = (address) => {
    var result = bech32_1.bech32.decode(address);
    var data = bech32_1.bech32.fromWords(result.words);
    return {
        version: result.words[0],
        prefix: result.prefix,
        data: Buffer.from(data)
    };
};
exports.fromBech32 = fromBech32;
const convertBits = (data, from, to, strictMode) => {
    const length = strictMode
        ? Math.floor((data.length * from) / to)
        : Math.ceil((data.length * from) / to);
    const mask = (1 << to) - 1;
    const result = Buffer.alloc(length);
    let index = 0;
    let accumulator = 0;
    let bits = 0;
    for (const value of data) {
        accumulator = (accumulator << from) | value;
        bits += from;
        while (bits >= to) {
            bits -= to;
            result[index] = (accumulator >> bits) & mask;
            ++index;
        }
    }
    if (!strictMode) {
        if (bits > 0) {
            result[index] = (accumulator << (to - bits)) & mask;
            ++index;
        }
    }
    else {
        throw new Error("Bits cannot be converted");
    }
    return result;
};
exports.convertBits = convertBits;
const decodeSaplingAddress = (address) => {
    const result = (0, exports.fromBech32)(address);
    const data = (0, exports.convertBits)(result.data, 5, 8, false);
    return { d: data.subarray(0, 10), pk_d: data.subarray(10) };
};
exports.decodeSaplingAddress = decodeSaplingAddress;
