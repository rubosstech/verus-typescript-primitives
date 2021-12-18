"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCall = void 0;
class ApiCall {
    constructor(chain, cmd) {
        this.chain = chain;
        this.cmd = cmd;
    }
    prepare() {
        return [this.chain, this.cmd, this.getParams()];
    }
}
exports.ApiCall = ApiCall;
