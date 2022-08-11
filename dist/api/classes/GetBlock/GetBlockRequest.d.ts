import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetBlockRequest extends ApiRequest {
    hashOrHeight: string | number;
    verbosity?: number;
    constructor(chain: string, hashOrHeight: string | number, verbosity?: number);
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): GetBlockRequest;
    toJson(): ApiPrimitiveJson;
}
