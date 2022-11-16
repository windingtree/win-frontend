import type { Reducer } from 'react';
import type { Action } from './actions';
import type { State } from './types';
import { useReducer } from 'react';
import { cryptoReducer } from './cryptoReducer';
import { recordsReducer } from './recordsReducer';
import { searchReducer } from './searchReducer';
import { getState, storageReducer } from './storage';
import Logger from '../utils/logger';
import { checkOutReducer } from './checkOutReducer';
import { selectedFacilityReducer } from './selectedFacilityReducer';
import { bookingsReducer } from './bookingsReducer';
import { defaultCurrencyCode } from '../config';
import { userSettingsReducer } from './userSettingsReducer';
import { localStorageConfig, sessionStorageConfig } from 'src/config/storageConfig';
import { priceFilterReducer } from './priceFilterReducer';
import { allowedCookiesReducer } from './cookiesReducer';

const logger = Logger('mainReducer');

export const mainReducer = (state: State, action: Action): State => {
  const type = action.type;
  logger.debug('Action:', type, action.payload);

  try {
    switch (type) {
      default:
        return state;
    }
  } catch (error) {
    logger.error(error);
    return state;
  }
};

const initialState: State = {
  isConnecting: true,
  facilities: [],
  offers: [],
  authentication: {
    timestamp: 0
  },
  userSettings: {
    preferredCurrencyCode: defaultCurrencyCode
  },
  priceFilter: []
};

export const combineReducers =
  (reducers: Reducer<State, Action>[]): Reducer<State, Action> =>
  (state: State, action: Action): State => {
    let updatedState = state;

    for (const reducer of reducers) {
      updatedState = reducer(updatedState, action);
    }

    return updatedState;
  };

export const useAppReducer = () => {
  const storedState = getState(); // Restoration of the Dapp state

  return useReducer(
    combineReducers([
      mainReducer,
      searchReducer,
      allowedCookiesReducer,
      checkOutReducer,
      cryptoReducer,
      recordsReducer,
      selectedFacilityReducer,
      bookingsReducer,
      userSettingsReducer,
      priceFilterReducer,
      // Always must be the last
      storageReducer(localStorageConfig, sessionStorageConfig)
    ]),
    {
      ...initialState,
      ...storedState
    }
  );
};
