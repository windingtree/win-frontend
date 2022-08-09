import type { PricedOffer } from '@windingtree/glider-types/types/derbysoft';
import { backend } from '../config';
import { Request } from '.';

export interface Data {
  pricedOffer: PricedOffer;
}

export interface PricedOfferResponse {
  data: Data;
}

export class PricedOfferRequest implements Request {
  public readonly url: string;
  public readonly method = 'post';

  public constructor(offerId: string) {
    this.url = `${backend.url}/offers/${offerId}/price`;
  }
}
