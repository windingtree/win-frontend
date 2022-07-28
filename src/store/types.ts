import type { TypedDataDomain } from '@ethersproject/abstract-signer';
import type { StaticProvider } from '../hooks/useRpcProvider';
import type { Web3ModalProvider, Web3ModalSignInFunction, Web3ModalSignOutFunction } from '../hooks/useWeb3Modal';

export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

export interface Location {
  coordinates: number[];
  type: string;
}

export interface Address {
  addressLine: string[];
  country: string;
  city: string;
  state: string;
  postalCode: string;
  premise: string;
}

export interface Phone {
  areaCityCode: string;
  countryAccessCode: string;
  phoneNumber: string;
}

export interface Amenity {
  name: string;
  description: string;
  otaCode: string;
}

export interface MaximumOccupancy {
  adults: number;
  children: number;
}

export interface RoomCustomData {
  roomId: string;
  rateId: string;
  rateName: string;
  rateDescription: string;
  roomName: string;
}

export interface Policies {
  [key: string]: string;
}

export interface Room {
  name: string;
  size?: any;
  amenities: Amenity[];
  description: string;
  maximumOccupancy: MaximumOccupancy;
  media?: any;
  customData: RoomCustomData;
  policies: Policies;
}

export interface CheckInOutPolicy {
  checkOutTime: `${number}:${number}:${number}`;
  checkInTime: `${number}:${number}:${number}`;
}

export interface HotelCustomData {
  supplierId: string;
  status: string;
  ariType: string;
  timezone: string;
  rateType: string;
  maxChildAge?: number;
  brandCode: string;
  chainCode: string;
  childRateType?: any;
  settings: any;
}

export interface Facility {
  id: string;
  providerId: string;
  providerHotelId: string;
  hotelName: string;
  description: string;
  location: Location;
  addresses: Address[];
  phones: Phone[];
  emails: string[];
  roomTypes: Room[];
  checkInOutPolicy: CheckInOutPolicy;
  rating: number;
  customData: HotelCustomData;
}

export interface CheckOut {
  id?: string;
  spaceId: string;
  facilityId: string;
  from: string;
  to: string;
  roomsNumber: number;
  timestamp: number;
  // [key: string]: unknown;
}

export interface State {
  isConnecting: boolean;
  staticProvider?: StaticProvider;
  provider?: Web3ModalProvider;
  signIn?: Web3ModalSignInFunction;
  signOut?: Web3ModalSignOutFunction;
  account?: string;
  serviceProviderDataDomain?: TypedDataDomain;
  facilities: Facility[];
  authentication: {
    token?: string;
    timestamp: number;
  };
  checkout?: CheckOut;
  [key: string]: unknown | GenericStateRecord[];
}
