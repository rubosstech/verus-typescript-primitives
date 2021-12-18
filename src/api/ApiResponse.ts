import { ApiCommunication } from "./ApiCommunication";
import { ApiPrimitiveJson } from "./ApiPrimitive";

export class ApiResponse implements ApiCommunication {
  result: ApiPrimitiveJson;

  constructor(result) {
    this.result = result;
  }
  
  toJson(): ApiPrimitiveJson {
    return this.result;
  }
}
