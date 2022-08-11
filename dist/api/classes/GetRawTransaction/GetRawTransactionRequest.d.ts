import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetRawTransactionRequest extends ApiRequest {
    txid: string;
    verbose?: number;
    constructor(chain: string, txid: string, verbose?: number);
    getParams(): Array<ApiPrimitive>;
    static fromJson(object: ApiPrimitiveJson): GetRawTransactionRequest;
    toJson(): ApiPrimitiveJson;
}
