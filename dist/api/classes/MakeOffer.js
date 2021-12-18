"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeOffer = void 0;
const ApiCall_1 = require("../ApiCall");
const cmds_1 = require("../../constants/cmds");
class MakeOffer extends ApiCall_1.ApiCall {
    constructor(chain, fromaddress, offer, returntx, feeamount) {
        super(chain, cmds_1.MAKE_OFFER);
        this.fromaddress = fromaddress;
        this.offer = offer;
        this.returntx = returntx;
        this.feeamount = feeamount;
    }
    getParams() {
        const params = [this.fromaddress, this.offer, this.returntx, this.feeamount];
        return params.filter(x => x != null);
    }
    static fromJson(object) {
        return new MakeOffer(object.chain, object.fromaddress, object.offer, object.returntx, object.feeamount);
    }
    toJson() {
        return {
            chain: this.chain,
            fromaddress: this.fromaddress,
            offer: this.offer,
            returntx: this.returntx,
            feeamount: this.feeamount
        };
    }
}
exports.MakeOffer = MakeOffer;
