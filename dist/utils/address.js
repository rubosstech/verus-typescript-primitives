"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBase58Check = exports.fromBase58Check = void 0;
const bs58check = require("bs58check");
const fromBase58Check = (address) => {
    var payload = bs58check.decode(address);
    // TODO: 4.0.0, move to "toOutputScript"
    if (payload.length < 21)
        throw new TypeError(address + " is too short");
    if (payload.length > 22)
        throw new TypeError(address + " is too long");
    var multibyte = payload.length === 22;
    var offset = multibyte ? 2 : 1;
    var version = multibyte ? payload.readUInt16BE(0) : payload[0];
    var hash = payload.slice(offset);
    return { version: version, hash: hash };
};
exports.fromBase58Check = fromBase58Check;
const toBase58Check = (hash, version) => {
    // Zcash adds an extra prefix resulting in a bigger (22 bytes) payload. We identify them Zcash by checking if the
    // version is multibyte (2 bytes instead of 1)
    var multibyte = version > 0xff;
    var size = multibyte ? 22 : 21;
    var offset = multibyte ? 2 : 1;
    var payload = Buffer.allocUnsafe(size);
    multibyte
        ? payload.writeUInt16BE(version, 0)
        : payload.writeUInt8(version, 0);
    hash.copy(payload, offset);
    return bs58check.encode(payload);
};
exports.toBase58Check = toBase58Check;
