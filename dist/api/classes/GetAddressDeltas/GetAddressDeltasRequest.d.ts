import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
interface Addresses {
    addresses: Array<string>;
    start?: number;
    end?: number;
    chaininfo?: boolean;
    verbosity?: number;
    friendlynames?: boolean;
}
export declare class GetAddressDeltasRequest extends ApiRequest {
    addresses: Addresses;
    constructor(chain: string, addresses: Addresses);
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): GetAddressDeltasRequest;
    toJson(): ApiPrimitiveJson;
}
export {};
