import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
import { GET_BLOCK } from "../../../constants/cmds";

export class GetBlockRequest extends ApiRequest {
  hashOrHeight: string | number;
  verbosity?: number;

  constructor(chain: string, hashOrHeight: string | number, verbosity?: number) {
    super(chain, GET_BLOCK);
    this.hashOrHeight = hashOrHeight;
    this.verbosity = verbosity;
  }

  getParams(): Array<ApiPrimitive> {
    const params = [
      this.hashOrHeight,
      this.verbosity,
    ];

    return params.filter((x) => x != null);
  }

  static fromJson(object: ApiPrimitiveJson): GetBlockRequest {
    return new GetBlockRequest(
      object.chain as string,
      object.hashOrHeight as string | number,
      object.verbosity != null ? (object.verbosity as number) : undefined
    );
  }

  toJson(): ApiPrimitiveJson {
    return {
      chain: this.chain,
      hashOrHeight: this.hashOrHeight,
      verbosity: this.verbosity
    };
  }
}
