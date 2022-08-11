import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitive, ApiPrimitiveJson } from "../../ApiPrimitive";
import { GET_ADDRESS_BALANCE } from "../../../constants/cmds";

export class GetAddressBalanceRequest extends ApiRequest {
  addresses: { addresses: Array<string>; friendlynames?: boolean };

  constructor(chain: string, addresses: { addresses: Array<string>; friendlynames?: boolean }) {
    super(chain, GET_ADDRESS_BALANCE);
    this.addresses = addresses;
  }

  getParams(): Array<ApiPrimitive> {
    return [this.addresses];
  }

  static fromJson(object: ApiPrimitiveJson): GetAddressBalanceRequest {
    return new GetAddressBalanceRequest(
      object.chain as string,
      object.addresses as { addresses: Array<string>; friendlynames?: boolean }
    );
  }

  toJson(): ApiPrimitiveJson {
    return {
      chain: this.chain,
      addresses: this.addresses,
    };
  }
}
