import { backend } from '../config';
import { Request } from '.';

export class PricedOfferRequest implements Request {
  public readonly url: string;
  public readonly method = 'post';
  public readonly withCredentials = true;

  public constructor(offerId: string) {
    this.url = `${backend.url}/api/hotels/offers/${offerId}/price`;
  }
}
