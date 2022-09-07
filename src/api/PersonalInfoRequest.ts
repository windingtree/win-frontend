import type { PersonalInfo } from '../store/types';
import { backend } from '../config';
import { Request } from '.';
import { PassengerType } from './OffersRequest';

export interface PersonalInfoBody {
  firstnames: string[];
  lastnames: string[];
  contactInformation: string[];
  birthdate: Date | null;
  type: PassengerType;
  civility?: string;
  gender?: string;
}

export class PersonalInfoRequest implements Request {
  public readonly url: string;
  public readonly method = 'post';
  public readonly data: PersonalInfoBody[];

  public constructor(offerId: string, personalInfo: PersonalInfo) {
    this.url = `${backend.url}/api/booking/${offerId}/guests`;
    this.data = [
      {
        firstnames: [personalInfo.firstname],
        lastnames: [personalInfo.lastname],
        contactInformation: [personalInfo.email, personalInfo.phone],
        birthdate: personalInfo.birthdate,
        type: PassengerType.adult
      }
    ];
  }
}
