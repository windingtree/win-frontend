import type { Reducer } from 'react';
import type { Action } from './actions';
import type { State } from './types';
import { useReducer } from 'react';
import { web3ModalReducer } from './web3ModalReducer';
import { cryptoReducer } from './cryptoReducer';
import { recordsReducer } from './recordsReducer';
import { searchReducer } from './searchReducer';
import { getState, storageReducer } from './localStorage';
import Logger from '../utils/logger';
import { checkOutReducer } from './checkOutReducer';
import { selectedFacilityReducer } from './selectedFacilityReducer';
import { bookingsReducer } from './bookingsReducer';
import { localStorageConfig, sessionStorageConfig } from '../config';

const logger = Logger('mainReducer');

export const mainReducer = (state: State, action: Action): State => {
  const type = action.type;
  logger.debug('Action:', type, action.payload);

  try {
    switch (type) {
      case 'SET_CONNECTING':
        return {
          ...state,
          isConnecting: action.payload
        };
      case 'SET_ACCOUNT':
        return {
          ...state,
          account: action.payload
        };
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
  }
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
      web3ModalReducer,
      searchReducer,
      checkOutReducer,
      cryptoReducer,
      recordsReducer,
      selectedFacilityReducer,
      bookingsReducer,
      // Always must be the last
      storageReducer(localStorageConfig, sessionStorageConfig)
    ]),
    {
      ...initialState,
      ...storedState
    }
  );
};
