import { ApiCommunication } from "./ApiCommunication";
import { ApiPrimitive, ApiPrimitiveJson } from "./ApiPrimitive";

export abstract class ApiRequest implements ApiCommunication {
  chain: string;
  cmd: string;

  abstract getParams(): Array<ApiPrimitive>;
  abstract toJson(): ApiPrimitiveJson;

  constructor(chain: string, cmd: string) {
    this.chain = chain;
    this.cmd = cmd;
  }

  prepare(): [string, string, Array<ApiPrimitive>] {
    return [this.chain, this.cmd, this.getParams()];
  }
}
