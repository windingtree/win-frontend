import type { PersonalInfo } from '../store/types';
import { backend } from '../config';
import { Request } from '.';
import { PassengerType } from './OffersRequest';

export interface T1 {
  firstnames: string[];
  lastnames: string[];
  contactInformation: string[];
  birthdate: Date | null;
  type: PassengerType;
}

export interface PersonalInfoBody {
  T1: T1;
}

export class PersonalInfoRequest implements Request {
  public readonly url: string;
  public readonly method = 'post';
  public readonly body: PersonalInfoBody;

  public constructor(offerId: string, personalInfo: PersonalInfo) {
    this.url = `${backend.url}/offers/${offerId}/pii`;
    this.body = {
      T1: {
        firstnames: [personalInfo.firstname],
        lastnames: [personalInfo.lastname],
        contactInformation: [personalInfo.email, personalInfo.phone],
        birthdate: personalInfo.birthdate,
        type: PassengerType.adult
      }
    };
  }
}
