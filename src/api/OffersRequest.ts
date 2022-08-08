import type { Accommodation, Offer } from '../types/offers';
import { LatLngTuple } from 'leaflet';
import { SearchParams } from '../store/types';
import { backend } from '../config';
import { Request } from '.';

export interface Location {
  lat: number;
  lon: number;
  radius: number;
}

export interface ResponseData {
  accomodations: Accommodation[];
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
          radius: 2000
        },
        arrival: searchParams.arrival,
        departure: searchParams.departure,
        roomCount: searchParams.roomCount
      },
      passengers: [
        {
          type: PassengerType.adult,
          count: searchParams.adults
        },
        {
          type: PassengerType.child,
          count: searchParams.children,
          childrenAges: [13]
        }
      ]
    };
  }
}
