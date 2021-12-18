import { ApiCall } from "../ApiCall";
import { ApiPrimitive, ApiPrimitiveJson } from "../ApiPrimitive";
import { OfferForMaking } from "../../offers/OfferForMaking";
export declare class MakeOffer extends ApiCall {
    fromaddress: string;
    offer: OfferForMaking;
    returntx?: boolean;
    feeamount?: number;
    constructor(chain: string, fromaddress: string, offer: OfferForMaking, returntx: boolean, feeamount: number);
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): MakeOffer;
    toJson(): ApiPrimitiveJson;
}
