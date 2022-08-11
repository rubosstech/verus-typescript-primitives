import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetOffersRequest extends ApiRequest {
    currencyorid: string;
    iscurrency?: boolean;
    withtx?: boolean;
    constructor(chain: string, currencyorid: string, iscurrency?: boolean, withtx?: boolean);
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): GetOffersRequest;
    toJson(): ApiPrimitiveJson;
}
