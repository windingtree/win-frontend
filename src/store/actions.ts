import type { TypedDataDomain } from '@ethersproject/abstract-signer';
import type { NetworkInfo, CryptoAsset } from '../config';
import type { StaticProvider } from '../hooks/useRpcProvider';
import type { Web3ModalProvider, Web3ModalSignInFunction, Web3ModalSignOutFunction } from '../hooks/useWeb3Modal';
import type { CheckOut, GenericStateRecord } from './types';

export interface SetConnectingAction {
  type: 'SET_CONNECTING';
  payload: boolean;
}

export interface SetStaticProviderAction {
  type: 'SET_STATIC_PROVIDER';
  payload?: StaticProvider;
}

export interface SetProviderAction {
  type: 'SET_PROVIDER';
  payload?: Web3ModalProvider;
}

export interface SetWeb3ModalSignInAction {
  type: 'SET_WEB3MODAL_SIGN_IN';
  payload?: Web3ModalSignInFunction;
}

export interface SetWeb3ModalSignOutAction {
  type: 'SET_WEB3MODAL_SIGN_OUT';
  payload?: Web3ModalSignOutFunction;
}

export interface SetAccountAction {
  type: 'SET_ACCOUNT';
  payload: string | undefined;
}

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

export interface SetServiceProvider {
  type: 'SET_SERVICE_PROVIDER';
  payload: TypedDataDomain | undefined;
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

export type Action =
  | SetCheckOutAction
  | SetAuthenticationTokenAction
  | SetConnectingAction
  | SetStaticProviderAction
  | SetProviderAction
  | SetWeb3ModalSignInAction
  | SetWeb3ModalSignOutAction
  | SetAccountAction
  | SetSelectedNetwork
  | SetSelectedAsset
  | SetRecordAction
  | RemoveRecordAction
  | ResetRecordAction
  | SetServiceProvider;
