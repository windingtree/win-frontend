import { Request } from '.';

export interface Location {
  lat: number;
  lon: number;
}

export interface Data {
  places: Location[];
}

export interface CoordinatesResponse {
  data: Data;
}

export class CoordinatesRequest implements Request {
  public readonly url: string;
  public readonly method = 'get';

  public constructor(place: string) {
    this.url = `https://nominatim.openstreetmap.org/search?format=json&q=${place}`;
  }
}
