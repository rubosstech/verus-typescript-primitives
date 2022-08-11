import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetInfoRequest extends ApiRequest {
    constructor(chain: string);
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): GetInfoRequest;
    toJson(): ApiPrimitiveJson;
}
