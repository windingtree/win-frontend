import type { TypedDataDomain } from '@ethersproject/abstract-signer';
import type { Facility, PricedOffer } from '../types/offers';
import type { NetworkInfo, CryptoAsset } from '../config';
import type { StaticProvider } from '../hooks/useRpcProvider';
import type {
  Web3ModalProvider,
  Web3ModalSignInFunction,
  Web3ModalSignOutFunction
} from '../hooks/useWeb3Modal';

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

export interface CheckInOutPolicy {
  checkOutTime: `${number}:${number}:${number}`;
  checkInTime: `${number}:${number}:${number}`;
}
export interface PersonalInfo {
  firstname: string;
  lastname: string;
  birthday: Date;
  email: string;
  phone: string;
}

export interface CheckOut {
  pricedOffer: PricedOffer;
  personalInfo?: PersonalInfo;
  facilityId: string;
}

export interface SearchParams {
  place: string;
  arrival: string;
  departure: string;
  roomCount: number;
  children: number;
  adults: number;
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
  // offers: Offer[];
  authentication: {
    token?: string;
    timestamp: number;
  };
  checkout?: CheckOut;
  selectedNetwork?: NetworkInfo;
  selectedAsset?: CryptoAsset;
  searchParams?: SearchParams;
  [key: string]: unknown | GenericStateRecord[];
}
