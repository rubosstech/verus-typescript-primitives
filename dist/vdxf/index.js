"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerusIDSignature = exports.VDXFObject = void 0;
__exportStar(require("./keys"), exports);
__exportStar(require("./scopes"), exports);
class VDXFObject {
    constructor(key) {
        this.vdxfkey = key;
    }
    stringable() {
        return {};
    }
    toString() {
        return JSON.stringify(this.stringable());
    }
}
exports.VDXFObject = VDXFObject;
class VerusIDSignature extends VDXFObject {
    constructor(sig, vdxfkey) {
        super(vdxfkey.vdxfid);
        this.signature = sig.signature;
    }
    stringable() {
        return {
            vdxfkey: this.vdxfkey,
            signature: this.signature,
        };
    }
}
exports.VerusIDSignature = VerusIDSignature;
