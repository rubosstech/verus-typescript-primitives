import { OfferForMaking } from "../offers/OfferForMaking";
import { ListedOffer } from "../offers/OfferList";
export declare type ApiPrimitive = string | number | boolean | null | OfferForMaking | ApiPrimitiveJson | ListedOffer | Array<ApiPrimitive>;
export declare type ApiPrimitiveJson = {
    [key: string]: ApiPrimitive | undefined;
};
