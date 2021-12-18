import { ApiCommunication } from "./ApiCommunication";
import { ApiPrimitive, ApiPrimitiveJson } from "./ApiPrimitive";
export declare abstract class ApiRequest implements ApiCommunication {
    chain: string;
    cmd: string;
    abstract getParams(): Array<ApiPrimitive>;
    abstract toJson(): ApiPrimitiveJson;
    constructor(chain: string, cmd: string);
    prepare(): [string, string, Array<ApiPrimitive>];
}
