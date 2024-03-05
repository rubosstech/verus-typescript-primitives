"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyID = void 0;
const vdxf_1 = require("../constants/vdxf");
const classes_1 = require("../vdxf/classes");
class KeyID extends classes_1.Hash160 {
    constructor(hash = Buffer.alloc(0)) {
        super(hash, vdxf_1.R_ADDR_VERSION, false);
    }
    fromBuffer(buffer, varlength, offset) {
        const ret = super.fromBuffer(buffer, varlength, offset);
        this.version = vdxf_1.R_ADDR_VERSION;
        return ret;
    }
}
exports.KeyID = KeyID;
