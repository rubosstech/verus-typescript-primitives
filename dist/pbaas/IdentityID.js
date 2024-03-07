"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityID = void 0;
const vdxf_1 = require("../constants/vdxf");
const classes_1 = require("../vdxf/classes");
class IdentityID extends classes_1.Hash160 {
    constructor(hash = Buffer.alloc(0)) {
        super(hash, vdxf_1.I_ADDR_VERSION, false);
    }
}
exports.IdentityID = IdentityID;
