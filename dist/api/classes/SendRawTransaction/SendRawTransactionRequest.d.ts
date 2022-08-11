import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class SendRawTransactionRequest extends ApiRequest {
    hexstring: string;
    allowhighfees?: boolean;
    constructor(chain: string, hexstring: string, allowhighfees?: boolean);
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): SendRawTransactionRequest;
    toJson(): ApiPrimitiveJson;
}
