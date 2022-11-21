import type { NetworkInfo, CryptoAsset } from '@windingtree/win-commons/dist/types';
import type {
  BookingsAuthResponse,
  OrganizerInformation
} from '@windingtree/glider-types/dist/win';
import type {
  BookingInfoType,
  CheckOut,
  GenericStateRecord,
  SearchParams
} from './types';
import { CurrencyCode } from '../hooks/useCurrencies';
import { PriceRange } from '../hooks/useAccommodationMultiple';
import { Cookies } from '../hooks/useAllowedCookies';

export interface SetRecordAction {
  type: 'SET_RECORD';
  payload: {
    name: string;
    record: GenericStateRecord;
  };
}

export interface RemoveRecordAction {
  type: 'REMOVE_RECORD';
  payload: {
    name: string;
    id: string;
  };
}

export interface ResetRecordAction {
  type: 'RESET_RECORD';
  payload: {
    name: string;
  };
}

export interface SetAuthenticationTokenAction {
  type: 'SET_AUTHENTICATION_TOKEN';
  payload: {
    token?: string;
    timestamp: number;
  };
}

export interface SetCheckOutAction {
  type: 'SET_CHECKOUT';
  payload: CheckOut;
}

export interface SetSelectedNetwork {
  type: 'SET_SELECTED_NETWORK';
  payload: NetworkInfo;
}

export interface SetSelectedAsset {
  type: 'SET_SELECTED_ASSET';
  payload: CryptoAsset;
}

export interface SetSearchParams {
  type: 'SET_SEARCH_PARAMS';
  payload: SearchParams;
}

export interface SetSelectedFacilityId {
  type: 'SET_SELECTED_FACILITY_ID';
  payload: string;
}

export interface ResetSelectedFacilityId {
  type: 'RESET_SELECTED_FACILITY_ID';
  payload?: undefined;
}

export interface SetWalletAuthAction {
  type: 'SET_WALLET_AUTH';
  payload?: BookingsAuthResponse;
}

export interface SetOrganizerInfo {
  type: 'SET_ORGANIZER_INFO';
  payload?: OrganizerInformation;
}

export interface SetBookingInfo {
  type: 'SET_BOOKING_INFO';
  payload?: BookingInfoType;
}

export interface SetPreferredCurrency {
  type: 'SET_PREFERRED_CURRENCY';
  payload?: CurrencyCode;
}

export interface SetPriceFilterAction {
  type: 'SET_PRICE_FILTER';
  payload: PriceRange[];
}

export interface clearPriceFilterAction {
  type: 'CLEAR_PRICE_FILTER';
  payload?: null;
}

export interface SetAllowedCookiesAction {
  type: 'SET_ALLOWED_COOKIES';
  payload: Cookies;
}

export type UserSettingsAction = SetPreferredCurrency;
export type PriceFilterAction = SetPriceFilterAction | clearPriceFilterAction;

export type Action =
  | SetAllowedCookiesAction
  | SetSearchParams
  | SetCheckOutAction
  | SetAuthenticationTokenAction
  | SetSelectedNetwork
  | SetSelectedAsset
  | SetWalletAuthAction
  | SetRecordAction
  | RemoveRecordAction
  | ResetRecordAction
  | SetSelectedFacilityId
  | ResetSelectedFacilityId
  | SetOrganizerInfo
  | SetBookingInfo
  | UserSettingsAction
  | PriceFilterAction;
