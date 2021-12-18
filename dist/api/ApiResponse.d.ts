import { ApiCommunication } from "./ApiCommunication";
import { ApiPrimitiveJson } from "./ApiPrimitive";
export declare class ApiResponse implements ApiCommunication {
    result: ApiPrimitiveJson;
    constructor(result: any);
    toJson(): ApiPrimitiveJson;
}
