import type { Accommodation, Offer } from '@windingtree/glider-types/types/derbysoft';
import { LatLngTuple } from 'leaflet';
import { SearchParams } from '../store/types';
import { backend } from '../config';
import { Request } from '.';
import type { AnySchema } from '@windingtree/org.id-utils/dist/object';

export const SearchParamsSchema: AnySchema = {
  allOf: [
    {
      $ref: '#/definitions/OneReference'
    }
  ],
  definitions: {
    OneReference: {
      type: 'object',
      properties: {
        place: {
          type: 'string'
        },
        arrival: {
          type: 'string'
        },
        departure: {
          type: 'string'
        },
        roomCount: {
          type: 'number'
        },
        children: {
          type: 'number'
        },
        adults: {
          type: 'number'
        }
      },
      required: ['place', 'arrival', 'departure', 'roomCount', 'children', 'adults']
    }
  }
};

export interface Location {
  lat: number;
  lon: number;
  radius: number;
}

export interface ResponseData {
  accommodations: Accommodation[];
  offers: Offer[];
}

export interface Response {
  data: ResponseData;
  status: number;
  message: string;
}

export interface Data {
  rooms: Response;
  derbySoft: Response;
}

export interface OffersResponse {
  data: Data;
}

export enum PassengerType {
  child = 'CHD',
  adult = 'ADT'
}

export interface Passenger {
  type: PassengerType;
  count: number;
  childrenAges?: number[];
}

export interface RequestAccommodation {
  location: Location;
  arrival: string;
  departure: string;
  roomCount: number;
}

export interface OffersBody {
  accommodation: RequestAccommodation;
  passengers: Passenger[];
}

export class OffersRequest implements Request {
  public readonly url: string;
  public readonly data: OffersBody;
  public readonly method = 'post';

  public constructor(center: LatLngTuple, searchParams: SearchParams) {
    this.url = `${backend.url}/api/derby-soft/offers/search`;
    this.data = {
      accommodation: {
        location: {
          lon: Number(center[1]),
          lat: Number(center[0]),
          radius: 20000
        },
        arrival: searchParams.arrival,
        departure: searchParams.departure,
        roomCount: searchParams.roomCount
      },
      passengers: [
        {
          type: PassengerType.adult,
          count: searchParams.adults
        }
      ]
    };
    if (searchParams.children > 0) {
      this.data.passengers.push({
        type: PassengerType.child,
        count: searchParams.children,
        childrenAges: Array.from({ length: searchParams.children }, () => 13)
      });
    }
  }
}
