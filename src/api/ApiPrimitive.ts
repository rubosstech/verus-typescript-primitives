import { OfferForMaking } from "../offers/OfferForMaking";
import { ListedOffer } from "../offers/OfferList";

export type ApiPrimitive =
  | string
  | number
  | boolean
  | null
  | OfferForMaking
  | ApiPrimitiveJson
  | ListedOffer
  | Array<ApiPrimitive>;

export type ApiPrimitiveJson = { [key: string]: ApiPrimitive | undefined };