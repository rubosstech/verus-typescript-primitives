"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoDestination = void 0;
const classes_1 = require("../vdxf/classes");
class NoDestination extends classes_1.Hash160 {
    constructor() {
        super(Buffer.alloc(0), 0, false);
    }
    fromBuffer(buffer, varlength, offset) {
        return offset;
    }
}
exports.NoDestination = NoDestination;
