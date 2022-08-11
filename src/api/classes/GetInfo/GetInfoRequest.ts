import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
import { GET_INFO } from "../../../constants/cmds";

export class GetInfoRequest extends ApiRequest {
  constructor(chain: string) {
    super(chain, GET_INFO);
  }

  getParams(): Array<ApiPrimitive> {
    return [];
  }

  static fromJson(object: ApiPrimitiveJson): GetInfoRequest {
    return new GetInfoRequest(object.chain as string);
  }

  toJson(): ApiPrimitiveJson {
    return {
      chain: this.chain,
    };
  }
}
