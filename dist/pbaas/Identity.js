"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identity = void 0;
const varuint_1 = require("../utils/varuint");
const bufferutils_1 = require("../utils/bufferutils");
const Principal_1 = require("./Principal");
const address_1 = require("../utils/address");
const vdxf_1 = require("../constants/vdxf");
const vdxf_2 = require("../vdxf");
const bn_js_1 = require("bn.js");
const bech32 = require('bech32');
const VERSION_PBAAS = 3;
const VERSION_INVALID = 0;
const { BufferReader, BufferWriter } = bufferutils_1.default;
function fromBech32(address) {
    var result = bech32.decode(address);
    var data = bech32.fromWords(result.words.slice(1));
    return {
        version: result.words[0],
        prefix: result.prefix,
        data: Buffer.from(data)
    };
}
function convertBits(data, from, to, strictMode) {
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
        throw new Error("Input cannot be converted");
    }
    return result;
}
function decodeSaplingAddress(address) {
    const result = fromBech32(address);
    const data = convertBits(result.data, 5, 8, false);
    return { d: data.slice(0, 10), pk_d: data.slice(10) };
}
class Identity extends Principal_1.Principal {
    constructor(data) {
        var _a;
        super(data);
        if (data === null || data === void 0 ? void 0 : data.parent)
            this.parent = data.parent;
        if (data === null || data === void 0 ? void 0 : data.name)
            this.name = data.name;
        if (data === null || data === void 0 ? void 0 : data.systemid)
            this.system_id = data.systemid;
        this.contentmap = (data === null || data === void 0 ? void 0 : data.contentmap) ? new Map(data.contentmap) : new Map();
        if (data === null || data === void 0 ? void 0 : data.contentmultimap) {
            if (typeof data.contentmultimap == "object") {
                this.contentmultimap = contentmultimapFromObject(data.contentmultimap);
            }
            else {
                throw new Error("multimap root not an object");
            }
        }
        if (data === null || data === void 0 ? void 0 : data.revocationauthority)
            this.revocation_authority = data.revocationauthority;
        if (data === null || data === void 0 ? void 0 : data.recoveryauthority)
            this.recovery_authority = data.recoveryauthority;
        if (data === null || data === void 0 ? void 0 : data.timelock)
            this.timelock = data.timelock;
        this.private_addresses = ((_a = data === null || data === void 0 ? void 0 : data.private_addresses) === null || _a === void 0 ? void 0 : _a.map((addr) => { return decodeSaplingAddress(addr); })) || new Array();
    }
    dataByteLength() {
        let byteLength = 0;
        byteLength += this._dataByteLength(); //get the principal byte length
        byteLength += 20; //uint160 parent
        byteLength += varuint_1.default.encodingLength(Buffer.from(this.name, "utf8").length); // name compact size
        byteLength += Buffer.from(this.name, "utf8").length; // name_in_utf8_bytes
        // contentmultimap
        if (this.version.toNumber() >= VERSION_PBAAS) {
            byteLength += this.contentmultimap ? varuint_1.default.encodingLength(this.contentmultimap.size) : 0;
            if (this.contentmultimap) {
                for (const [key, value] of this.contentmultimap.entries()) {
                    byteLength += 20; //uint160 key
                    byteLength += varuint_1.default.encodingLength(value.length);
                    for (const n of value) {
                        byteLength += varuint_1.default.encodingLength(n.length);
                        byteLength += n.length;
                    }
                }
            }
        }
        //contentmap
        if (this.version.toNumber() < VERSION_PBAAS) {
            byteLength += varuint_1.default.encodingLength(this.contentmap.size);
            for (const m in this.contentmap) {
                byteLength += 20; //uint160 key
                byteLength += 32; //uint256 hash
            }
        }
        //contentmap2
        byteLength += varuint_1.default.encodingLength(this.contentmap.size);
        for (const m in this.contentmap) {
            byteLength += 20; //uint160 key
            byteLength += 32; //uint256 hash
        }
        byteLength += 20; //uint160 revocation authority
        byteLength += 20; //uint160 recovery authority
        // privateaddresses
        byteLength += varuint_1.default.encodingLength(this.private_addresses.length | 0);
        for (const n of this.private_addresses) {
            byteLength += varuint_1.default.encodingLength(n.d.length);
            byteLength += n.d.length; // const 11
            byteLength += 32; //pk_d hash
        }
        // post PBAAS
        if (this.version.toNumber() >= VERSION_PBAAS) {
            byteLength += 20; //uint160 systemid
            byteLength += 4; //uint32 unlockafter
        }
        return byteLength;
    }
    toBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
        bufferWriter.writeSlice(this._toBuffer());
        bufferWriter.writeSlice((0, address_1.fromBase58Check)(this.parent).hash);
        bufferWriter.writeCompactSize(Buffer.from(this.name, "utf8").length);
        bufferWriter.writeSlice(Buffer.from(this.name, "utf8"));
        //contentmultimap
        if (this.version.toNumber() >= VERSION_PBAAS) {
            bufferWriter.writeCompactSize(this.contentmultimap.size);
            for (const [key, value] of this.contentmultimap.entries()) {
                bufferWriter.writeSlice((0, address_1.fromBase58Check)(key).hash);
                bufferWriter.writeCompactSize(value.length);
                for (const n of value) {
                    bufferWriter.writeCompactSize(n.length);
                    bufferWriter.writeSlice(n);
                }
            }
        }
        //contentmap
        if (this.version.toNumber() < VERSION_PBAAS) {
            bufferWriter.writeCompactSize(this.contentmap.size);
            for (const [key, value] of this.contentmap.entries()) {
                bufferWriter.writeSlice(value);
            }
        }
        //contentmap2
        bufferWriter.writeCompactSize(this.contentmap.size);
        for (const [key, value] of this.contentmap.entries()) {
            bufferWriter.writeSlice(value);
        }
        bufferWriter.writeSlice((0, address_1.fromBase58Check)(this.revocation_authority).hash);
        bufferWriter.writeSlice((0, address_1.fromBase58Check)(this.recovery_authority).hash);
        // privateaddresses
        bufferWriter.writeCompactSize(this.private_addresses.length);
        for (const n of this.private_addresses) {
            bufferWriter.writeCompactSize(n.d.length);
            bufferWriter.writeSlice(n.d);
            bufferWriter.writeSlice(n.pk_d);
        }
        // post PBAAS
        if (this.version.toNumber() >= VERSION_PBAAS) {
            bufferWriter.writeSlice((0, address_1.fromBase58Check)(this.system_id).hash);
            bufferWriter.writeUInt32(this.timelock);
        }
        return bufferWriter.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        reader.offset = this._fromBuffer(reader.buffer, reader.offset);
        this.parent = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
        this.name = Buffer.from(reader.readVarSlice()).toString('utf8');
        //contentmultimap
        if (this.version.toNumber() >= VERSION_PBAAS) {
            const contentMapSize = reader.readVarInt();
            this.contentmultimap = new Map();
            for (var i = 0; i < contentMapSize.toNumber(); i++) {
                const contentMapKey = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
                var innervector = reader.readVector();
                this.contentmultimap.set(contentMapKey, innervector);
            }
        }
        // contentmap
        if (this.version.toNumber() < VERSION_PBAAS) {
            const contentMultiMapSize = reader.readVarInt();
            this.contentmap = new Map();
            for (var i = 0; i < contentMultiMapSize.toNumber(); i++) {
                const contentMapKey = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
                const hash = reader.readSlice(32);
                this.contentmap.set(contentMapKey, hash);
            }
        }
        const contentMapSize = reader.readVarInt();
        this.contentmap = new Map();
        for (var i = 0; i < contentMapSize.toNumber(); i++) {
            const contentMapKey = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
            const hash = reader.readSlice(32);
            this.contentmap.set(contentMapKey, hash);
        }
        this.revocation_authority = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
        this.recovery_authority = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
        const numPrivateAddresses = reader.readVarInt();
        for (var i = 0; i < numPrivateAddresses.toNumber(); i++) {
            this.private_addresses.push({ d: Buffer.from(reader.readVector()), pk_d: reader.readSlice(20) });
        }
        if (this.version.toNumber() >= VERSION_PBAAS) {
            this.system_id = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
            this.timelock = reader.readUInt32();
        }
        return reader.offset;
    }
}
exports.Identity = Identity;
function contentmultimapFromObject(input) {
    var contentmultimap = new Map;
    var nVersion = 1;
    const keys = Object.keys(input);
    const values = keys.map((item) => input[item]);
    for (var i = 0; i < keys.length; i++) {
        try {
            const key = (0, address_1.fromBase58Check)(keys[i]).hash;
            if (key != null) {
                if (Array.isArray(values[i])) {
                    for (var j = 0; j < values[i].length; j++) {
                        const oneValue = values[i][j];
                        var items = [];
                        if (typeof oneValue == "string") {
                            items.push(Buffer.from(oneValue, 'hex'));
                        }
                        else if (typeof oneValue == "object") {
                            const mapBytesValue = VectorEncodeVDXFUni(oneValue);
                            if (mapBytesValue.length === 0 || nVersion == VERSION_INVALID) {
                                nVersion = VERSION_INVALID;
                                throw new Error("object not as expected");
                            }
                            items.push(mapBytesValue);
                        }
                    }
                    contentmultimap.set(keys[i], items);
                }
                else if (typeof values[i] === "string") {
                    if (isHexByteString(values[i])) {
                        contentmultimap.set(keys[i], Buffer.from(items));
                    }
                    else {
                        nVersion = VERSION_INVALID;
                        throw new Error("string not formatted as hex");
                    }
                }
                else if (typeof values[i] === "object") {
                    const mapBytesValue = VectorEncodeVDXFUni(values[i]);
                    var item = [];
                    if (mapBytesValue.length === 0 || nVersion == VERSION_INVALID) {
                        nVersion = VERSION_INVALID;
                        throw new Error("object not as expected");
                    }
                    item.push(mapBytesValue);
                    contentmultimap.set(keys[i], item);
                }
                else {
                    nVersion = VERSION_INVALID;
                    throw new Error("not valid content multimap sub type");
                }
            }
            else {
                nVersion = VERSION_INVALID;
                throw new Error("key in multimap == null");
            }
        }
        catch (e) {
            nVersion = VERSION_INVALID;
            throw new Error(e.message);
        }
    }
    return contentmultimap;
}
function VectorEncodeVDXFUni(obj) {
    const keys = Object.keys(obj);
    const values = keys.map((item) => obj[item]);
    var bufsize = 0;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == vdxf_2.DATA_TYPE_STRING.vdxfid) {
            bufsize += vdxf_1.HASH160_BYTE_LENGTH;
            bufsize += 1; // varint length 1
            bufsize += 2; // ss type + ver (lengths)
            bufsize += varuint_1.default.encodingLength(Buffer.from(values[i], 'utf8').length);
            bufsize += Buffer.from(values[i], 'utf8').length;
        }
        else {
            throw new Error("VDXF key not found: " + keys[i]);
        }
        // TODO: add alltypes
    }
    const bufferWriter = new BufferWriter(Buffer.alloc(bufsize));
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === vdxf_2.DATA_TYPE_STRING.vdxfid) {
            bufferWriter.writeSlice((0, address_1.fromBase58Check)(keys[i]).hash);
            bufferWriter.writeVarInt(new bn_js_1.BN(1));
            bufferWriter.writeVarInt(new bn_js_1.BN(Buffer.from(values[i], 'utf8').length + 3)); //NOTE 3 is from ss type + ver + vdxfidver 
            bufferWriter.writeVarSlice(Buffer.from(values[i], 'utf8'));
        }
        else {
            throw new Error("VDXF key not found: " + keys[i]);
        }
        // TODO: add alltypes
    }
    return bufferWriter.buffer;
}
function isHexByteString(str) {
    const hexByteRegex = /^[0-9a-fA-F]{2}$/;
    return hexByteRegex.test(str);
}
