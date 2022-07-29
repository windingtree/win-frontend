export interface Price {
  currency: string;
  public: number;
  taxes: number;
}

export interface Fare {
  usage: string;
  amount: number;
  description: string;
}

export interface PricedItem {
  fare: Fare[];
  taxes: number[];
}

export interface Offer {
  expiration: Date;
  price: Price;
  pricedItems: PricedItem[];
  disclosures: string[][];
}

export interface Header {
  version: string;
  token: string;
  supplierId: string;
  distributorId: string;
}

export interface RawResponse {
  bookingToken: string;
  header: Header;
}

export interface Data {
  offerId: string;
  offer: Offer;
  rawResponse: RawResponse;
}

export interface RootObject {
  data: Data;
  status: string;
}
