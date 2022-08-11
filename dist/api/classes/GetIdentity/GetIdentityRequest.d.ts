import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetIdentityRequest extends ApiRequest {
    nameOrAddress: string;
    height?: number;
    txproof?: boolean;
    txproofheight?: number;
    constructor(chain: string, nameOrAddress: string, height?: number, txproof?: boolean, txproofheight?: number);
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): GetIdentityRequest;
    toJson(): ApiPrimitiveJson;
}
