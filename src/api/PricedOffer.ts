import { backend } from '../config';
import { Request } from '.';

export class PricedOfferRequest implements Request {
  public readonly url: string;
  public readonly method = 'post';

  public constructor(offerId: string) {
    this.url = `${backend.url}/api/derby-soft/offers/${offerId}/price`;
  }
}
