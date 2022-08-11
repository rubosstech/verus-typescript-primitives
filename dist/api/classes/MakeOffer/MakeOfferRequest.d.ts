import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
import { OfferForMaking } from "../../../offers/OfferForMaking";
export declare class MakeOfferRequest extends ApiRequest {
    fromaddress: string;
    offer: OfferForMaking;
    returntx?: boolean;
    feeamount?: number;
    constructor(chain: string, fromaddress: string, offer: OfferForMaking, returntx?: boolean, feeamount?: number);
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): MakeOfferRequest;
    toJson(): ApiPrimitiveJson;
}
