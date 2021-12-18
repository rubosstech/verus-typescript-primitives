import { ApiPrimitiveJson } from "./ApiPrimitive";

export interface ApiCommunication {
  toJson: () => ApiPrimitiveJson
}