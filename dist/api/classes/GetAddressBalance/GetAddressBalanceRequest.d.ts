import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetAddressBalanceRequest extends ApiRequest {
    addresses: {
        addresses: Array<string>;
        friendlynames?: boolean;
    };
    constructor(chain: string, addresses: {
        addresses: Array<string>;
        friendlynames?: boolean;
    });
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): GetAddressBalanceRequest;
    toJson(): ApiPrimitiveJson;
}
